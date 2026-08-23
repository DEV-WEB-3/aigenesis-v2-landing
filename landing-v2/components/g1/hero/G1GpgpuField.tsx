'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { buildGpgpuData, gpgpuSize, sampleLogoSilhouette, LOGO_WORLD_W } from '@/lib/webgl/g1GpgpuTargets'
import { G1 } from '@/lib/design/g1'

// shader del plano del logo: textura del cristal + barrido de brillo (vida premium)
const LOGO_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const LOGO_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uShine;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    if (t.a < 0.35) discard; // solo el cristal escribe profundidad (para el weaving de los aros)
    // barrido diagonal de luz FINO y lento que recorre el cristal (elegante)
    float band = exp(-pow((vUv.x + vUv.y - mod(uTime * 0.09, 2.4)) * 6.5, 2.0));
    vec3 col = t.rgb + band * uShine * t.a * vec3(0.78, 0.9, 1.0);
    gl_FragColor = vec4(col, t.a * uOpacity);
  }
`

// ARO orbital de cristal líquido: brillo fresnel en el borde + energía que circula.
const RING_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vFres;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 N = normalize(normalMatrix * normal);
    vec3 V = normalize(-mv.xyz);
    vFres = pow(1.0 - abs(dot(N, V)), 1.5);
    gl_Position = projectionMatrix * mv;
  }
`
const RING_FRAG = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSpeed;
  varying vec2 vUv;
  varying float vFres;
  void main() {
    vec3 base = mix(uColA, uColB, 0.5 + 0.5 * sin(vUv.x * 6.2831853));
    // energía líquida que circula a lo largo del aro (uv.x recorre el anillo)
    float flow = exp(-pow(sin(3.14159265 * (vUv.x * 3.0 - uTime * uSpeed)) * 2.1, 2.0));
    // el tubo brilla (base) + realce de borde (fresnel) + energía que circula
    vec3 col = base * (0.95 + 0.55 * vFres) + flow * vec3(0.86, 0.94, 1.0) * 0.9;
    float a = (0.6 + 0.55 * vFres + flow * 0.5) * uOpacity;
    gl_FragColor = vec4(col * a, a);
  }
`

// NODO — esfera de cristal (fresnel rim + núcleo). Reusa RING_VERT (vFres).
const NODE_FRAG = /* glsl */ `
  uniform vec3 uCol;
  uniform float uOpacity;
  varying float vFres;
  void main() {
    vec3 col = uCol * (0.35 + 1.05 * vFres) + vec3(0.72, 0.86, 1.0) * pow(vFres, 3.0) * 0.7;
    float a = (0.42 + 0.85 * vFres) * uOpacity;
    gl_FragColor = vec4(col * a, a);
  }
`

// colores firma de cada trilogía (Acto 1/2/3)
const TINT_VIOLET = new THREE.Color(G1.violet)
const TINT_CYAN = new THREE.Color(G1.cyan)
const TINT_AMBER = new THREE.Color(G1.amber)
const _tintTmp = new THREE.Color()

/**
 * CAMPO GPGPU de G1 — densidad tipo qpaycard (hasta 65k partículas) simuladas en
 * GPU. Las posiciones viven en una textura FBO; un shader las lleva hacia el
 * objetivo (orbe / G1 / campo) con flujo + pulverización. El render lee esa
 * textura en el vertex shader. Estados guiados por fases, todo en la tarjeta.
 */

const SIM = /* glsl */ `
  uniform sampler2D uTarget;
  uniform float uTime;
  uniform float uEase;
  uniform float uFlow;
  uniform float uBurst;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 cur = texture2D( texturePosition, uv );
    vec3 pos = cur.xyz;
    float seed = cur.w;
    vec3 tgt = texture2D( uTarget, uv ).xyz;
    float t = uTime * 0.5;
    float ang = seed * 6.2831853;
    vec3 flow = vec3(
      sin(pos.y * 1.6 + t + ang),
      cos(pos.x * 1.6 - t * 0.9 + ang),
      sin((pos.x + pos.y) * 1.1 + t * 0.7) * 0.7
    ) * uFlow;
    float ease = uEase * (0.55 + seed * 1.1);
    pos += (tgt + flow - pos) * ease;
    if (uBurst > 0.001) {
      vec3 dir = normalize(pos + 1e-4);
      pos += dir * uBurst * (0.6 + seed) * 0.06;
    }
    gl_FragColor = vec4(pos, seed);
  }
`

const VERT = /* glsl */ `
  uniform sampler2D uPositions;
  uniform float uTime;
  uniform float uSize;
  attribute vec2 aRef;
  attribute vec3 aColor;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vTw;
  varying float vDepth;
  void main() {
    vec3 pos = texture2D(uPositions, aRef).xyz;
    vColor = aColor;
    float tw = 0.5 + 0.5 * sin(uTime * 2.3 + aSeed * 6.2831853);
    vTw = tw;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = clamp((mv.z + 6.8) / 3.2, 0.0, 1.0);
    gl_PointSize = uSize * (0.4 + aSeed * 1.7) * (0.55 + 0.55 * tw) * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D uSprite;
  uniform float uOpacity;
  uniform vec3 uTint;
  uniform float uTintAmount;
  varying vec3 vColor;
  varying float vTw;
  varying float vDepth;
  void main() {
    vec4 tex = texture2D(uSprite, gl_PointCoord);
    float a = tex.a;
    vec3 base = mix(vColor, uTint, uTintAmount); // tinte por acto (violeta/cian/ámbar)
    vec3 col = base * (0.7 + 0.9 * vTw) * (0.5 + 0.7 * vDepth);
    gl_FragColor = vec4(col * a, a * uOpacity);
  }
`

/**
 * Los tres AROS orbitales: cada uno en su propio plano (tilt distinto), con su
 * dirección y velocidad de precesión propia (signos opuestos) y su energía que
 * circula. NO giran todos igual; respetan profundidad (weaving con el logo).
 */
const RINGS = [
  { r: 2.28, tiltX: 1.05, tiltZ: 0.16, prec: 0.11, speed: 0.5, a: G1.cyan, b: G1.blue, nodes: [{ ang: 0.4, s: 0.13, c: G1.cyan }, { ang: 3.7, s: 0.08, c: G1.blue }] },
  { r: 1.98, tiltX: 0.6, tiltZ: -0.46, prec: -0.16, speed: -0.4, a: G1.violet, b: G1.magenta, nodes: [{ ang: 1.5, s: 0.15, c: G1.violet }] },
  { r: 2.52, tiltX: 1.32, tiltZ: 0.72, prec: 0.08, speed: 0.64, a: G1.cyan, b: G1.violet, nodes: [{ ang: 2.4, s: 0.11, c: G1.amber }, { ang: 5.2, s: 0.09, c: G1.cyan }] },
] as const

type Phase = { key: string; target: 'orb' | 'g1' | 'field'; dur: number; bright: number }
const PHASES: Phase[] = [
  { key: 'orb-in', target: 'orb', dur: 2.0, bright: 1.0 },
  { key: 'orb-hold', target: 'orb', dur: 2.6, bright: 0.95 },
  { key: 'to-field-1', target: 'field', dur: 1.8, bright: 1.0 },
  { key: 'g1-in', target: 'g1', dur: 2.0, bright: 1.0 },
  { key: 'g1-hold', target: 'g1', dur: 2.6, bright: 0.95 },
  { key: 'to-field-2', target: 'field', dur: 1.8, bright: 1.0 },
]

function makeSprite(): THREE.CanvasTexture {
  const S = 64
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const g = c.getContext('2d')!
  const cx = S / 2, cy = S / 2
  const rg = g.createRadialGradient(cx, cy, 0, cx, cy, S / 2)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(0.18, 'rgba(255,255,255,0.9)')
  rg.addColorStop(0.5, 'rgba(255,255,255,0.16)')
  rg.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = rg; g.fillRect(0, 0, S, S)
  g.globalCompositeOperation = 'lighter'
  g.translate(cx, cy)
  for (let k = 0; k < 4; k++) {
    g.save(); g.rotate((Math.PI / 4) * k)
    const len = S * 0.5, w = k % 2 === 0 ? 2.4 : 1.3, al = k % 2 === 0 ? 0.85 : 0.4
    const lg = g.createLinearGradient(-len, 0, len, 0)
    lg.addColorStop(0, 'rgba(255,255,255,0)')
    lg.addColorStop(0.5, `rgba(255,255,255,${al})`)
    lg.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = lg; g.fillRect(-len, -w / 2, len * 2, w)
    g.restore()
  }
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t
}

export function G1GpgpuField({
  baseOpacity = 0.82,
  progressRef,
}: {
  baseOpacity?: number
  /** Si se pasa, el estado lo maneja el SCROLL (0..1), no el reloj: sky→orbe→G1→disolución. */
  progressRef?: { current: number }
}) {
  const gl = useThree((s) => s.gl)
  const grp = useRef<THREE.Group>(null)
  const st = useRef({ phase: 0, t: 0 })

  const sys = useMemo(() => {
    const size = gpgpuSize()
    const data = buildGpgpuData(size)
    const gpu = new GPUComputationRenderer(size, size, gl)
    const dt = gpu.createTexture()
    ;(dt.image.data as unknown as Float32Array).set(data.init)
    const posVar = gpu.addVariable('texturePosition', SIM, dt)
    gpu.setVariableDependencies(posVar, [posVar])
    const mk = (arr: Float32Array) => {
      const t = gpu.createTexture()
      ;(t.image.data as unknown as Float32Array).set(arr)
      t.needsUpdate = true
      return t
    }
    const orbTex = mk(data.orb), g1Tex = mk(data.g1), fieldTex = mk(data.field)
    Object.assign(posVar.material.uniforms, {
      uTarget: { value: fieldTex },
      uTime: { value: 0 },
      uEase: { value: 0.02 },
      uFlow: { value: 0.05 },
      uBurst: { value: 0 },
    })
    const err = gpu.init()
    if (err) console.error('[G1GpgpuField] GPGPU init error:', err)

    const sprite = makeSprite()
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.count * 3), 3))
    geo.setAttribute('aRef', new THREE.BufferAttribute(data.refs, 2))
    geo.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uPositions: { value: null },
        uTime: { value: 0 },
        uSize: { value: size < 160 ? 15 : 11 },
        uSprite: { value: sprite },
        uOpacity: { value: 0 },
        uTint: { value: new THREE.Color(G1.violet) },
        uTintAmount: { value: 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { gpu, posVar, orbTex, g1Tex, fieldTex, sprite, geo, mat, size, data }
  }, [gl])

  // Texturas del logo (monograma cristal + órbitas) y muestreo de la SILUETA
  // hacia el target g1 → el polvo forma el logo EXACTO, alineado con el plano 3D.
  const [logoTex, setLogoTex] = useState<THREE.Texture | null>(null)
  const [logoAspect, setLogoAspect] = useState(995 / 560)
  const logoMatRef = useRef<THREE.ShaderMaterial>(null)
  const logoMeshRef = useRef<THREE.Mesh>(null)
  const ringMeshRefs = useRef<Array<THREE.Mesh | null>>([])
  const ringMatRefs = useRef<Array<THREE.ShaderMaterial | null>>([])
  const nodeMatRefs = useRef<Array<THREE.ShaderMaterial | null>>([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let alive = true
    loader.load('/brand/g1/g1-monogram-560.webp', (t) => {
      if (!alive) return
      t.colorSpace = THREE.SRGBColorSpace
      const img = t.image as HTMLImageElement
      setLogoAspect((img.naturalWidth || 995) / (img.naturalHeight || 560))
      setLogoTex(t)
      // reemplaza el target g1 (texto) por la SILUETA del logo, mismo mapeo que el plano
      const sil = sampleLogoSilhouette(img, sys.size, sys.data.seeds)
      if (sil) { (sys.g1Tex.image.data as unknown as Float32Array).set(sil); sys.g1Tex.needsUpdate = true }
    })
    return () => { alive = false }
  }, [sys])

  useEffect(() => {
    return () => {
      sys.geo.dispose()
      sys.mat.dispose()
      sys.sprite.dispose()
      sys.orbTex.dispose()
      sys.g1Tex.dispose()
      sys.fieldTex.dispose()
      sys.gpu.dispose()
    }
  }, [sys])

  useEffect(() => () => { logoTex?.dispose() }, [logoTex])

  useFrame((s, dt) => {
    const u = sys.posVar.material.uniforms
    u.uTime!.value = s.clock.elapsedTime
    let bright = 0.95
    let tintAmt = 0
    let opMul = 1 // el polvo se atenúa cuando el logo real cristaliza encima
    let logoOp = 0 // opacidad del logo 3D (cristaliza en la fusión)

    if (progressRef) {
      // MODO SCROLL: el estado lo decide el progreso 0..1 del relato
      const p = Math.min(1, Math.max(0, progressRef.current))
      let tex = sys.fieldTex, flow = 0.06, ease = 0.04, burst = 0
      if (p < 0.12) { tex = sys.fieldTex; flow = 0.06; ease = 0.035 } // Acto 0 · cielo
      else if (p < 0.6) { tex = sys.orbTex; flow = 0.025; ease = 0.05 } // Actos 1–3 · orbes
      else if (p < 0.82) { tex = sys.g1Tex; flow = 0.02; ease = 0.05 } // Acto 4 · fusión G1
      else { tex = sys.g1Tex; flow = 0.03; ease = 0.05; burst = 0 } // Acto 5 · el polvo se asienta en G1 (converge, no dispersa)
      u.uTarget!.value = tex
      u.uFlow!.value = flow
      u.uEase!.value = ease
      u.uBurst!.value = burst
      // tinte firma por acto: violeta (Aitech) → cian (TAG) → ámbar (Génesis)
      if (p >= 0.1 && p <= 0.62) {
        const local = Math.min(1, Math.max(0, (p - 0.12) / 0.48))
        if (local < 0.5) _tintTmp.copy(TINT_VIOLET).lerp(TINT_CYAN, local * 2)
        else _tintTmp.copy(TINT_CYAN).lerp(TINT_AMBER, (local - 0.5) * 2)
        tintAmt = 0.6 * Math.max(0, Math.min(1, Math.min((p - 0.1) / 0.05, (0.62 - p) / 0.05)))
        sys.mat.uniforms.uTint!.value.copy(_tintTmp)
      }
      // al cristalizar el logo (0.64→0.86) el polvo baja a aura sutil; vuelve al soltar
      const ss = (e0: number, e1: number, x: number) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) }
      const reveal = ss(0.58, 0.69, p) * (1 - ss(0.86, 0.93, p))
      opMul = 1 - 0.86 * reveal
      // el logo cristaliza a la par que el polvo se asienta (cross-fade: dust →
      // crystal). Llega al máximo rápido y SOSTIENE toda la fusión.
      logoOp = ss(0.56, 0.65, p) * (1 - ss(0.9, 0.97, p))
    } else {
      // MODO RELOJ: fases automáticas (preview suelto)
      const S = st.current
      S.t += dt
      if (S.t > PHASES[S.phase]!.dur) { S.t = 0; S.phase = (S.phase + 1) % PHASES.length }
      const ph = PHASES[S.phase]!
      const prev = PHASES[(S.phase - 1 + PHASES.length) % PHASES.length]!
      const pp = Math.min(1, S.t / ph.dur)
      const isShatter = ph.target === 'field' && prev.target !== 'field'
      const burst = isShatter ? Math.max(0, 1 - pp * 1.7) : 0
      bright = ph.bright
      u.uTarget!.value = ph.target === 'orb' ? sys.orbTex : ph.target === 'g1' ? sys.g1Tex : sys.fieldTex
      u.uEase!.value = isShatter ? 0.05 : ph.key.endsWith('hold') ? 0.02 : 0.03
      u.uFlow!.value = ph.key.endsWith('hold') ? 0.01 : 0.05 + burst * 0.03
      u.uBurst!.value = burst
    }

    sys.gpu.compute()
    const mu = sys.mat.uniforms
    mu.uPositions!.value = sys.gpu.getCurrentRenderTarget(sys.posVar).texture
    mu.uTime!.value = s.clock.elapsedTime
    const targetOp = baseOpacity * bright * 0.62 * opMul
    mu.uOpacity!.value += (targetOp - mu.uOpacity!.value) * (1 - Math.pow(0.02, dt))
    mu.uTintAmount!.value += (tintAmt - mu.uTintAmount!.value) * (1 - Math.pow(0.05, dt))

    if (grp.current) {
      grp.current.rotation.y += (s.pointer.x * 0.16 - grp.current.rotation.y) * 0.04
      grp.current.rotation.x += (-s.pointer.y * 0.1 - grp.current.rotation.x) * 0.04
    }

    // LOGO 3D — cristaliza con el polvo (mismo grupo/cámara → sin divergencia)
    const t = s.clock.elapsedTime
    let logoVis = logoOp // opacidad REALMENTE visible del logo (con su inercia)
    if (logoMatRef.current) {
      const uo = logoMatRef.current.uniforms
      uo.uOpacity!.value += (logoOp - uo.uOpacity!.value) * (1 - Math.pow(0.02, dt))
      uo.uTime!.value = t
      uo.uShine!.value = 0.3
      logoVis = uo.uOpacity!.value
    }
    // AROS 3D — cada uno precesa en su propio plano; opacidad ATADA a la del logo
    // (así aparecen/desaparecen exactamente igual que el logo, sin desfases).
    for (let i = 0; i < RINGS.length; i++) {
      const rc = RINGS[i]!
      const mesh = ringMeshRefs.current[i]
      const mat = ringMatRefs.current[i]
      if (mesh) mesh.rotation.set(rc.tiltX, t * rc.prec, rc.tiltZ) // tilt fijo + precesión propia
      if (mat) {
        const uo = mat.uniforms
        uo.uTime!.value = t
        uo.uOpacity!.value = logoVis
      }
    }
    // nodos (esferas): la misma opacidad del logo
    for (let i = 0; i < nodeMatRefs.current.length; i++) {
      const nm = nodeMatRefs.current[i]
      if (nm) nm.uniforms.uOpacity!.value = logoVis
    }
    // vida: respiración sutil del lockup
    const breathe = 1 + Math.sin(t * 0.9) * 0.012
    if (logoMeshRef.current) logoMeshRef.current.scale.setScalar(breathe)
  })

  return (
    <group ref={grp}>
      <points geometry={sys.geo} material={sys.mat} frustumCulled={false} renderOrder={0} />
      {/* LOGO — escribe profundidad (solo el cristal, por el discard) para que los
          aros que pasan por detrás queden ocultos (weaving real). */}
      {logoTex ? (
        <mesh ref={logoMeshRef} position={[0, 0, 0]} renderOrder={1}>
          <planeGeometry args={[LOGO_WORLD_W, LOGO_WORLD_W / logoAspect]} />
          <shaderMaterial
            ref={logoMatRef}
            vertexShader={LOGO_VERT}
            fragmentShader={LOGO_FRAG}
            transparent
            depthWrite
            depthTest
            uniforms={{ uMap: { value: logoTex }, uTime: { value: 0 }, uOpacity: { value: 0 }, uShine: { value: 0.3 } }}
          />
        </mesh>
      ) : null}

      {/* AROS 3D — torus de cristal líquido, cada uno en su plano orbital, con
          profundidad real (se testean contra la profundidad del logo). */}
      {RINGS.map((rc, i) => {
        const nodeBase = RINGS.slice(0, i).reduce((s, r) => s + r.nodes.length, 0)
        return (
          <mesh
            key={i}
            ref={(m) => { ringMeshRefs.current[i] = m }}
            scale={[rc.r, rc.r, rc.r]}
            renderOrder={2}
          >
            <torusGeometry args={[1, 0.05, 16, 300]} />
            <shaderMaterial
              ref={(m) => { ringMatRefs.current[i] = m as THREE.ShaderMaterial | null }}
              vertexShader={RING_VERT}
              fragmentShader={RING_FRAG}
              transparent
              depthWrite={false}
              depthTest={false}
              blending={THREE.AdditiveBlending}
              uniforms={{ uColA: { value: new THREE.Color(rc.a) }, uColB: { value: new THREE.Color(rc.b) }, uTime: { value: 0 }, uOpacity: { value: 0 }, uSpeed: { value: rc.speed } }}
            />
            {/* NODOS — esferas de cristal que orbitan sobre el aro (hijas → heredan la órbita) */}
            {rc.nodes.map((nd, k) => (
              <mesh key={k} position={[Math.cos(nd.ang), Math.sin(nd.ang), 0]} scale={nd.s / rc.r} renderOrder={3}>
                <sphereGeometry args={[1, 24, 24]} />
                <shaderMaterial
                  ref={(m) => { nodeMatRefs.current[nodeBase + k] = m as THREE.ShaderMaterial | null }}
                  vertexShader={RING_VERT}
                  fragmentShader={NODE_FRAG}
                  transparent
                  depthWrite={false}
                  depthTest={false}
                  blending={THREE.AdditiveBlending}
                  uniforms={{ uCol: { value: new THREE.Color(nd.c) }, uOpacity: { value: 0 } }}
                />
              </mesh>
            ))}
          </mesh>
        )
      })}
    </group>
  )
}
