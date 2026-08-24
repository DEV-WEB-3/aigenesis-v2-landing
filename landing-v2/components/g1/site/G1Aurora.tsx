'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { G1 } from '@/lib/design/g1'

/**
 * G1 AURORA — el fondo de motion premium por página (reemplaza las figuras de
 * partículas). Es el shader "Aurora" de React Bits (MIT) porteado de OGL a
 * three/R3F, sin sumar librería. Aurora que fluye, teñida por página con la
 * paleta de marca. Respeta prefers-reduced-motion (poster estático).
 */

const VERT = /* glsl */ `
  in vec3 position;
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec3 uColorStops[3];
  uniform vec2 uResolution;
  uniform float uBlend;
  out vec4 fragColor;

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  struct ColorStop { vec3 color; float position; };
  #define COLOR_RAMP(colors, factor, finalColor) {              \
    int index = 0;                                            \
    for (int i = 0; i < 2; i++) {                               \
       ColorStop currentColor = colors[i];                    \
       bool isInBetween = currentColor.position <= factor;    \
       index = int(mix(float(index), float(i), float(isInBetween))); \
    }                                                         \
    ColorStop currentColor = colors[index];                   \
    ColorStop nextColor = colors[index + 1];                  \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    ColorStop colors[3];
    colors[0] = ColorStop(uColorStops[0], 0.0);
    colors[1] = ColorStop(uColorStops[1], 0.5);
    colors[2] = ColorStop(uColorStops[2], 1.0);
    vec3 rampColor;
    COLOR_RAMP(colors, uv.x, rampColor);
    float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
    height = exp(height);
    height = (uv.y * 2.0 - height + 0.2);
    float intensity = 0.6 * height;
    float midPoint = 0.20;
    float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
    vec3 auroraColor = intensity * rampColor;
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
`

function AuroraPlane({ stops, amplitude, blend, speed }: { stops: string[]; amplitude: number; blend: number; speed: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
    return g
  }, [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: amplitude },
      uBlend: { value: blend },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColorStops: {
        value: stops.map((h) => {
          const c = new THREE.Color(h)
          return new THREE.Vector3(c.r, c.g, c.b)
        }),
      },
    }),
    [stops, amplitude, blend]
  )
  useFrame((s, dt) => {
    uniforms.uTime.value += dt * speed
    uniforms.uResolution.value.set(s.size.width * s.viewport.dpr, s.size.height * s.viewport.dpr)
  })
  useThree() // asegura re-render en resize
  return (
    <mesh geometry={geo} frustumCulled={false}>
      <rawShaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        glslVersion={THREE.GLSL3}
        transparent
        premultipliedAlpha
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

export type AuroraTint = 'brand' | 'eco' | 'flow' | 'warm' | 'calm'

const TINTS: Record<AuroraTint, string[]> = {
  brand: [G1.violet, G1.cyan, G1.amber],
  eco: [G1.cyan, G1.blue, G1.violet],
  flow: [G1.violet, G1.magenta, G1.amber],
  warm: [G1.amber, G1.magenta, G1.violet],
  calm: [G1.cyan, G1.violet, G1.cyan],
}

export function G1Aurora({
  tint = 'brand',
  amplitude = 1.1,
  blend = 0.55,
  speed = 0.3,
  className,
}: {
  tint?: AuroraTint
  amplitude?: number
  blend?: number
  speed?: number
  className?: string
}) {
  const reduce =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
  const stops = TINTS[tint]
  // PERF: solo renderiza cuando el hero está a la vista (fuera de pantalla, el
  // frameloop se apaga y deja de consumir GPU).
  const boxRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = boxRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((es) => setVisible(es[0]?.isIntersecting ?? true), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (reduce) {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 ${className ?? ''}`}
        style={{ background: `radial-gradient(80% 60% at 50% 0%, ${stops[0]}22, transparent 60%), radial-gradient(70% 50% at 70% 20%, ${stops[1]}18, transparent 62%)` }}
      />
    )
  }
  return (
    <div ref={boxRef} aria-hidden className={`pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 ${className ?? ''}`}>
      <Canvas gl={{ alpha: true, antialias: true, premultipliedAlpha: true }} dpr={[1, 1.3]} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0, 1] }}>
        <AuroraPlane stops={stops} amplitude={amplitude} blend={blend} speed={speed} />
      </Canvas>
    </div>
  )
}
