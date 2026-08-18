'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EMISSION } from '@/lib/design/tokens'

/**
 * EL UMBRAL DE ENERGIA.
 *
 * QUE ES
 * Una superficie esférica transparente alrededor de la nube de marcas. No se ve
 * como una bola: se ve como un borde de luz, porque sólo emite donde la
 * superficie se aleja de la cámara —el efecto Fresnel—, que es exactamente cómo
 * se comporta una pompa o un campo de fuerza.
 *
 * POR QUE SHADER PROPIO Y NO POSTPROCESADO
 * El proyecto tiene `@react-three/postprocessing`, y un `Bloom` habría sido más
 * rápido de escribir. Se descartó por tres razones medidas:
 *
 *  1. El bloom procesa el LIENZO ENTERO en varias pasadas. Aquí son 313.600 px
 *     por fotograma en el hero, que es lo primero que se ve — y el LCP ya costó
 *     bajarlo de 3,3 s a 1,7.
 *
 *  2. Un bloom global también difuminaría el logotipo que va DELANTE, y ese
 *     logotipo es el elemento LCP: enturbiarlo sería estropear justo la pieza
 *     que más se mira.
 *
 *  3. El resplandor que hace falta no es genérico: tiene que seguir el borde de
 *     la esfera. Eso es lo que hace un Fresnel, y sale en UNA pasada.
 *
 * La luz «tornasol» sale de recorrer la rampa de marca —magenta, violeta, azul,
 * cian— según el ángulo de visión. Es la misma rampa de los tokens, así que el
 * umbral no es un color inventado: es la paleta del portal puesta en movimiento.
 */

const VERTEX = /* glsl */ `
  varying vec3 vNormalMundo;
  varying vec3 vHaciaCamara;
  varying vec3 vPosLocal;

  void main() {
    vPosLocal = position;
    vNormalMundo = normalize(mat3(modelMatrix) * normal);
    vec4 posMundo = modelMatrix * vec4(position, 1.0);
    vHaciaCamara = normalize(cameraPosition - posMundo.xyz);
    gl_Position = projectionMatrix * viewMatrix * posMundo;
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTiempo;
  uniform float uIntensidad;
  uniform vec3 uMagenta;
  uniform vec3 uVioleta;
  uniform vec3 uAzul;
  uniform vec3 uCian;

  varying vec3 vNormalMundo;
  varying vec3 vHaciaCamara;
  varying vec3 vPosLocal;

  /* Rampa de marca: magenta -> violeta -> azul -> cian, en cuatro tramos. */
  vec3 rampaMarca(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.333) return mix(uMagenta, uVioleta, t / 0.333);
    if (t < 0.666) return mix(uVioleta, uAzul, (t - 0.333) / 0.333);
    return mix(uAzul, uCian, (t - 0.666) / 0.334);
  }

  void main() {
    /*
     * FRESNEL: 0 mirando de frente, 1 en el borde. Es lo que convierte una
     * esfera opaca en un contorno de luz — el centro queda transparente y deja
     * ver el logotipo, y el borde brilla.
     */
    float alineacion = abs(dot(normalize(vNormalMundo), normalize(vHaciaCamara)));
    /*
     * Exponente 3.2, y aqui hay una leccion.
     *
     * Lo subi a 6.5 creyendo que el shell «empastaba» el interior: medi la
     * franja central de una captura y daba +60 de luminancia sobre el fondo.
     * Pero esa franja incluye el LOGOTIPO y las PARTICULAS de la nube — estaba
     * atribuyendo al shell luz que no era suya.
     *
     * Aislado de verdad, ocultando la esfera y restando:
     *
     *              borde    interior
     *   fresnel 3.2  +88.8      +0.2
     *   fresnel 6.5  +30.7      +0.3
     *
     * El interior YA era transparente con 3.2. Subir el exponente no arreglo
     * nada: solo le quito dos tercios de la luz al borde, que es lo unico que
     * el efecto tiene que hacer.
     */
    float fresnel = pow(1.0 - alineacion, 3.2);

    /*
     * Latido lento y ondas que recorren la superficie. La frecuencia es baja a
     * proposito: esto acompaña, no compite con la nube de marcas que gira
     * dentro.
     */
    float onda = sin(vPosLocal.y * 5.0 - uTiempo * 0.65) * 0.5 + 0.5;
    float latido = sin(uTiempo * 0.45) * 0.5 + 0.5;

    /* El tono recorre la rampa segun la altura y el tiempo: eso es el tornasol. */
    float t = fract(vPosLocal.y * 0.32 + uTiempo * 0.045 + onda * 0.12);
    vec3 color = rampaMarca(t);

    float alfa = fresnel * uIntensidad * (0.72 + latido * 0.28);
    alfa += fresnel * onda * 0.16;

    /*
     * El color se multiplica por el propio Fresnel: con mezcla aditiva importa
     * cuanta luz SUMA cada pixel, no solo su alfa. Asi el borde emite y el
     * centro no aporta nada — medido, +0.2 de luminancia.
     */
    gl_FragColor = vec4(color * (0.85 + fresnel * 0.6), alfa);
  }
`

function aVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

export interface BrandSphereShellProps {
  radio: number
  /** 0 lo apaga. Permite bajarlo en `medium` sin quitar la capa. */
  intensidad?: number
}

export default function BrandSphereShell({ radio, intensidad = 1 }: BrandSphereShellProps) {
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTiempo: { value: 0 },
      uIntensidad: { value: intensidad },
      uMagenta: { value: aVec3(EMISSION.magenta) },
      uVioleta: { value: aVec3(EMISSION.violetHi) },
      uAzul: { value: aVec3(EMISSION.blueHi) },
      uCian: { value: aVec3(EMISSION.cyan) },
    }),
    [intensidad]
  )

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTiempo.value += delta
  })

  const geometria = useMemo(() => new THREE.SphereGeometry(radio * 1.04, 48, 32), [radio])
  useEffect(() => () => geometria.dispose(), [geometria])

  return (
    <mesh geometry={geometria} renderOrder={1}>
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        /*
         * `DoubleSide` porque se ve el interior de la cara trasera: un shell
         * transparente sin cara interior se ve partido por la mitad.
         *
         * `depthWrite: false` y `AdditiveBlending`, igual que la nube: el
         * umbral tiene que SUMAR luz sobre lo que hay detrás, no taparlo.
         */
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
