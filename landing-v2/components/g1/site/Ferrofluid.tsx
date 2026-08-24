'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { G1 } from '@/lib/design/g1'

/**
 * FERROFLUID — el shader "Ferrofluid" de React Bits (MIT) porteado de OGL a
 * three/R3F, sin sumar librería. Fluido magnético orgánico teñido con la paleta
 * de marca; se usa como fondo DENTRO del cristal del AiG Token. Respeta
 * prefers-reduced-motion (poster estático).
 *
 * El shader es el original (voronoi/delaunay + smin metaballs + rim/glow). Único
 * cambio: `vUv*iResolution.xy` → `gl_FragCoord.xy` (triángulo fullscreen sin uv).
 */
const VERT = /* glsl */ `
  attribute vec3 position;
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3  iResolution;
  uniform vec2  iMouse;
  uniform float iTime;

  uniform vec3  uColor0;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform vec3  uColor4;
  uniform vec3  uColor5;
  uniform vec3  uColor6;
  uniform vec3  uColor7;
  uniform int   uColorCount;

  uniform vec2  uFlow;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uTurbulence;
  uniform float uFluidity;
  uniform float uRimWidth;
  uniform float uSharpness;
  uniform float uShimmer;
  uniform float uGlow;
  uniform float uOpacity;
  uniform float uMouseEnabled;
  uniform float uMouseStrength;
  uniform float uMouseRadius;

  #define PI 3.14159265

  vec3 palette(float h) {
    int count = uColorCount;
    if (count < 1) count = 1;
    int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
    if (idx <= 0) return uColor0;
    if (idx == 1) return uColor1;
    if (idx == 2) return uColor2;
    if (idx == 3) return uColor3;
    if (idx == 4) return uColor4;
    if (idx == 5) return uColor5;
    if (idx == 6) return uColor6;
    return uColor7;
  }

  float hash(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float smin(float a, float b, float k) {
    float r = exp2(-a / k) + exp2(-b / k);
    return -k * log2(r);
  }

  float sinlerp(float a, float b, float w) {
    return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
  }

  float vn(vec2 p, float s, float seed) {
    vec2 cellp = floor(p / s);
    vec2 relp = mod(p, s);
    float g1 = hash(vec3(cellp, seed));
    float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
    float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
    float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
    float bx = sinlerp(g1, g2, relp.x / s);
    float tx = sinlerp(g4, g3, relp.x / s);
    return sinlerp(bx, tx, relp.y / s);
  }

  float dbn(vec2 p, float s, float seed) {
    float o = s / 2.0;
    float n0 = vn(p, s, seed);
    float n1 = vn(p + vec2(o, o), s, seed + 0.1);
    float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
    float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
    float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
    return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float ref = 700.0 / max(uScale, 0.05);
    vec2 p = fragCoord / iResolution.y * ref;

    float spd = 200.0 * uSpeed;
    float t = iTime;

    vec2 dir = uFlow;
    vec2 perp = vec2(-dir.y, dir.x);

    float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
    float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

    float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
    float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

    float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

    float mGlow = 0.0;
    if (uMouseEnabled > 0.5) {
      vec2 mp = iMouse / iResolution.y * ref;
      float md = length(p - mp) / ref;
      float rr = max(uMouseRadius, 0.02);
      mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
    }

    float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
    float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
    ltn = pow(ltn, uSharpness) * uGlow;
    ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

    float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
    vec3 col = palette(h);

    vec3 outc = col * ltn;
    float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
    fragColor = vec4(outc, a * uOpacity);
  }

  void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
  }
`

function FerrofluidPlane({ colors, speed, scale, turbulence, fluidity, rimWidth, sharpness, shimmer, glow, opacity, flow }: {
  colors: string[]
  speed: number
  scale: number
  turbulence: number
  fluidity: number
  rimWidth: number
  sharpness: number
  shimmer: number
  glow: number
  opacity: number
  flow: [number, number]
}) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
    return g
  }, [])

  const uniforms = useMemo(() => {
    const cols: THREE.Vector3[] = []
    for (let i = 0; i < 8; i++) {
      const c = new THREE.Color(colors[i] ?? 'black')
      cols.push(new THREE.Vector3(c.r, c.g, c.b))
    }
    return {
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iTime: { value: 0 },
      uColor0: { value: cols[0] },
      uColor1: { value: cols[1] },
      uColor2: { value: cols[2] },
      uColor3: { value: cols[3] },
      uColor4: { value: cols[4] },
      uColor5: { value: cols[5] },
      uColor6: { value: cols[6] },
      uColor7: { value: cols[7] },
      uColorCount: { value: Math.min(colors.length, 8) },
      uFlow: { value: new THREE.Vector2(flow[0], flow[1]) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uTurbulence: { value: turbulence },
      uFluidity: { value: fluidity },
      uRimWidth: { value: rimWidth },
      uSharpness: { value: sharpness },
      uShimmer: { value: shimmer },
      uGlow: { value: glow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: 0 },
      uMouseStrength: { value: 0 },
      uMouseRadius: { value: 0.3 },
    }
  }, [colors, speed, scale, turbulence, fluidity, rimWidth, sharpness, shimmer, glow, opacity, flow])

  useFrame((s, dt) => {
    uniforms.iTime.value += Math.min(dt, 0.05)
    uniforms.iResolution.value.set(s.size.width * s.viewport.dpr, s.size.height * s.viewport.dpr, 1)
  })

  return (
    <mesh geometry={geo} frustumCulled={false}>
      <rawShaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        premultipliedAlpha
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

export function Ferrofluid({
  colors = [G1.violet, G1.cyan, G1.amber],
  speed = 0.05,
  scale = 1.75,
  turbulence = 1.0,
  fluidity = 0.55,
  rimWidth = 0.95,
  sharpness = 1.05,
  shimmer = 0.4,
  glow = 1.35,
  opacity = 0.82,
  flow = [0, 1],
  className,
}: {
  colors?: string[]
  speed?: number
  scale?: number
  turbulence?: number
  fluidity?: number
  rimWidth?: number
  sharpness?: number
  shimmer?: number
  glow?: number
  opacity?: number
  flow?: [number, number]
  className?: string
}) {
  // PERF: pausa el frameloop cuando el cristal no está a la vista.
  const boxRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = boxRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((es) => setVisible(es[0]?.isIntersecting ?? true), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const reduce =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
  if (reduce) {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
        style={{ background: `radial-gradient(60% 70% at 30% 40%, ${colors[0]}22, transparent 60%), radial-gradient(55% 60% at 75% 60%, ${colors[1]}1e, transparent 62%)` }}
      />
    )
  }
  return (
    <div ref={boxRef} aria-hidden className={`pointer-events-none absolute inset-0 ${className ?? ''}`}>
      <Canvas gl={{ alpha: true, antialias: true, premultipliedAlpha: true }} dpr={[1, 1.15]} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0, 1] }}>
        <FerrofluidPlane colors={colors} speed={speed} scale={scale} turbulence={turbulence} fluidity={fluidity} rimWidth={rimWidth} sharpness={sharpness} shimmer={shimmer} glow={glow} opacity={opacity} flow={flow} />
      </Canvas>
    </div>
  )
}
