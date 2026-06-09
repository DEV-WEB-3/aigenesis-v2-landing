'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Vertex shader ────────────────────────────────────────────────────────────
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

    // Precalcular fresnel en vertex para pasar al fragment
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 viewDir = normalize(-mvPos.xyz);
    vFresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    gl_Position = projectionMatrix * mvPos;
  }
`

// ─── Fragment shader ──────────────────────────────────────────────────────────
// REGLA: R < G cuando B > 0.5. Violeta siempre tiene B dominante.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
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

    // ── Violeta profundo: B SIEMPRE el componente más alto ──
    // #4C1D95 en linear: R=0.055, G=0.012, B=0.310
    vec3 deep    = vec3(0.055, 0.012, 0.310);

    // #8B5CF6 en linear: R=0.264, G=0.098, B=0.902
    vec3 mid     = vec3(0.264, 0.098, 0.902);

    // Mezcla violeta pura — noise solo entre deep y mid, NUNCA hacia rojo
    vec3 body = mix(deep, mid, clamp(n * 0.6 + 0.4, 0.0, 1.0));

    // Rim cyan: #00E5FF — solo en el borde (fresnel alto)
    vec3 cyan = vec3(0.0, 0.800, 1.0);
    vec3 rim  = cyan * vFresnel * 1.2;

    // Final: cuerpo violeta + borde cyan
    vec3 color = body + rim;
    float alpha = (0.45 + vFresnel * 0.50) * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`

interface GenesisOrbProps {
  sectionIndexRef?: React.MutableRefObject<number>
}

export default function GenesisOrb({ sectionIndexRef }: GenesisOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { pointer } = useThree()

  const uniforms = useMemo<{
    uTime:    { value: number }
    uOpacity: { value: number }
  }>(() => ({
    uTime:    { value: 0 },
    uOpacity: { value: 1 },
  }), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t

    const section       = sectionIndexRef?.current ?? 0
    // Visible en Hero (0) y CTA final (8)
    const targetOpacity = (section === 0 || section === 8) ? 1 : 0
    uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * 0.05
    meshRef.current.visible = uniforms.uOpacity.value > 0.01

    const targetY =  pointer.x * 0.26
    const targetX = -pointer.y * 0.26
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.04
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.04
    meshRef.current.rotation.z += 0.0012

    const breathe = 1 + Math.sin(t * 0.4) * 0.03
    meshRef.current.scale.setScalar(breathe)
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <icosahedronGeometry args={[1.2, 6]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  )
}
