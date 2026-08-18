'use client'

import { EMISSION } from '@/lib/design/tokens'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1); p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i),             hash(i+vec3(1,0,0)), f.x),
          mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
          mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  void main() {
    vec3 n = normalize(normalMatrix * normal);
    vNormal = n;

    vec3 pos = position;
    float wave1 = sin(pos.x * 3.0 + uTime * 0.5) * cos(pos.y * 3.0 + uTime * 0.3);
    float wave2 = sin(pos.y * 2.5 + uTime * 0.4) * cos(pos.z * 2.5 + uTime * 0.6);
    float nz    = noise3(pos * 2.0 + uTime * 0.15);
    pos += normalize(position) * (wave1 * 0.018 + wave2 * 0.015 + nz * 0.012);

    vPosition = pos;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 viewDir = normalize(-mvPos.xyz);
    vFresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    gl_Position = projectionMatrix * mvPos;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFuchsiaMix;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1); p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i),             hash(i+vec3(1,0,0)), f.x),
          mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
          mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  void main() {
    float n = noise(vPosition * 2.2 + uTime * 0.08);

    // Aproximación lineal de EMISSION.blueHi / .violet / .magenta.
    // Sin hex aquí a propósito: una copia del valor en un comentario envejece en
    // silencio, y esta ya lo había hecho (citaba el magenta retirado).
    vec3 ionDeep  = vec3(0.04, 0.12, 0.38);
    vec3 ionMid   = vec3(0.12, 0.35, 0.92);
    vec3 coreMid  = vec3(0.22, 0.14, 0.68);
    vec3 fuchsia  = vec3(0.78, 0.10, 0.42);

    vec3 bodyBase = mix(ionDeep, mix(ionMid, coreMid, 0.45), clamp(n * 0.55 + 0.35, 0.0, 1.0));
    vec3 body     = mix(bodyBase, fuchsia, uFuchsiaMix * (0.35 + n * 0.25));

    vec3 rimIon     = vec3(0.15, 0.45, 1.0) * vFresnel * 0.85;
    vec3 rimFuchsia = fuchsia * vFresnel * uFuchsiaMix * 0.65;
    vec3 color      = body + rimIon + rimFuchsia;

    float alpha = (0.42 + vFresnel * 0.48) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`

/** Esfera final CTA — ligeramente más contenida que 1.2 legacy */
/** CTA orb — ~17% más compacto para fit desktop 100% zoom */
const ORB_RADIUS = 0.86
const ORB_GLOW_SCALE = 1.06

interface GenesisOrbProps {
  sectionIndexRef?: React.MutableRefObject<number>
}

export default function GenesisOrb({ sectionIndexRef }: GenesisOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  const uniforms = useMemo<{
    uTime: { value: number }
    uOpacity: { value: number }
    uFuchsiaMix: { value: number }
  }>(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uFuchsiaMix: { value: 0.22 },
  }), [])

  const glowOpacity = useRef(0)

  useFrame(() => {
    if (!meshRef.current) return

    // Phase 16 — esfera sólida reemplazada por Genesis Final Portal
    uniforms.uOpacity.value = 0
    glowOpacity.current = 0
    meshRef.current.visible = false
    if (glowRef.current) {
      glowRef.current.visible = false
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0
    }
  })

  return (
    <group position={[0, 0.5, 0]}>
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[ORB_RADIUS, 3]} />
        <meshBasicMaterial
          color={EMISSION.magenta}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[ORB_RADIUS, 6]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
