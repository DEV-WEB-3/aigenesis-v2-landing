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
// ÓRBITAS — el asset 2D MISMO como plano texturizado: posición y ángulos
// pixel-perfect e inmutables (exigencia del owner). Reusa LOGO_VERT (vUv).
const ORB_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    gl_FragColor = vec4(t.rgb, t.a * uOpacity);
  }
`

// NODO — esfera de cristal (fresnel rim + núcleo). Reusa RING_VERT (vFres).
const NODE_FRAG = /* glsl */ `
  uniform vec3 uCol;
  varying float vFres;
  void main() {
    vec3 col = uCol * (0.9 + 0.9 * vFres) + vec3(0.72, 0.86, 1.0) * pow(vFres, 3.0) * 0.7;
    gl_FragColor = vec4(col, 1.0);
  }
`

// NÚCLEO‑MISTERIO — el resplandor central que crea el campo de gravedad y que,
// al final, revela el G1. Billboard radial que pulsa. Reusa LOGO_VERT (vUv).
const CORE_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float core = exp(-d * d * 6.0) * 1.6;     // núcleo brillante y concentrado
    float halo = exp(-d * 2.4) * 0.55;        // halo de gravedad
    float pulse = 0.8 + 0.2 * sin(uTime * 1.5);
    vec3 col = mix(vec3(0.6, 0.85, 1.0), vec3(0.78, 0.52, 1.0), 0.5 + 0.5 * sin(uTime * 0.35));
    float a = clamp((core + halo) * pulse, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(col, a);
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
// KEPLER — resuelve la ecuación M = E − e·sinE (Newton, pocas iteraciones) para
// obtener la anomalía excéntrica E. Con M lineal en el tiempo, el asteroide barre
// áreas iguales en tiempos iguales (2ª ley): acelera en el periapsis, frena en el
// apoapsis. Ese es el giro hiper-realista.
function solveKepler(M: number, e: number): number {
  let E = M
  for (let i = 0; i < 5; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
  return E
}

/**
 * RUTAS ORBITALES — elipses MEDIDAS sobre el asset 2D (calibración por overlay
 * en navegador, imagen 1000×563): los asteroides cabalgan EXACTAMENTE sobre los
 * aros dibujados. `phi` en grados (sentido SVG, y hacia abajo).
 *   flat  : (522,332)  a=428 b=112 φ=0     — elipse ecuatorial grande
 *   azul  : (697,220)  a=269 b=82  φ=+24.6 — diagonal \ (tips verificados)
 *   magenta:(565,235)  a=253 b=151 φ=−22   — diagonal / (aproximada)
 */
const PATHS = [
  { cx: 522, cy: 332, a: 428, b: 112, phi: 0, speed: 0.4, ecc: 0.3, asts: [{ M0: 0.4, s: 0.1, c: G1.cyan }, { M0: 2.7, s: 0.055, c: G1.blue }, { M0: 4.7, s: 0.075, c: G1.cyan }] },
  { cx: 697, cy: 220, a: 269, b: 82, phi: 24.6, speed: 0.62, ecc: 0.34, asts: [{ M0: 1.4, s: 0.11, c: G1.violet }, { M0: 4.2, s: 0.05, c: G1.magenta }] },
  { cx: 565, cy: 235, a: 253, b: 151, phi: -22, speed: 0.52, ecc: 0.3, asts: [{ M0: 2.4, s: 0.08, c: G1.amber }] },
] as const

// proporción del lockup 2D del hero: órbitas 580px de ancho vs monograma 220px
const ORB_W = LOGO_WORLD_W * 2.636
const ORB_H = ORB_W * 563 / 1000
const PX = ORB_W / 1000 // mundo por píxel de la imagen de órbitas
// escala base del conjunto (átomo completo ENMARCADO en el viewport de la fusión)
const BASE_SCALE = 0.78

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
  const [orbTex, setOrbTex] = useState<THREE.Texture | null>(null)
  const [logoAspect, setLogoAspect] = useState(995 / 560)
  const logoMatRef = useRef<THREE.ShaderMaterial>(null)
  const logoMeshRef = useRef<THREE.Mesh>(null)
  const orbMatRef = useRef<THREE.ShaderMaterial>(null)
  const orbMeshRef = useRef<THREE.Mesh>(null)
  const nodeMeshRefs = useRef<Array<{ mesh: THREE.Mesh | null; M0: number; speed: number; ecc: number; path: number }>>([])
  const coreMatRef = useRef<THREE.ShaderMaterial>(null)
  const coreMeshRef = useRef<THREE.Mesh>(null)

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
    loader.load('/brand/g1/g1-orbits-1000.webp', (t) => {
      if (!alive) return
      t.colorSpace = THREE.SRGBColorSpace
      setOrbTex(t)
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

  useEffect(() => () => { logoTex?.dispose(); orbTex?.dispose() }, [logoTex, orbTex])

  useFrame((s, dt) => {
    const u = sys.posVar.material.uniforms
    u.uTime!.value = s.clock.elapsedTime
    let bright = 0.95
    let tintAmt = 0
    let opMul = 1 // el polvo se atenúa cuando el logo real cristaliza encima
    let logoOp = 0 // opacidad del logo 3D (cristaliza en la fusión)
    let ringVis = 0 // aros/nodos: presentes DESDE la entrada (campo de gravedad)
    let coreVis = 0 // núcleo-misterio: presente temprano, se funde al revelarse el logo
    let dockT = 0 // ESTACIONAMIENTO final: el logo sube y encoge hacia la cabeza

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
      // AROS/NODOS desde la entrada: fade-in 0.03→0.14 (al 45%), crescendo al 100%
      // en la fusión (0.5→0.68), se retiran al final para el handoff.
      ringVis = ss(0.015, 0.06, p) * (0.88 + 0.12 * ss(0.5, 0.68, p)) * (1 - ss(0.96, 1.0, p))
      // NÚCLEO-MISTERIO: presente desde la entrada, se funde cuando el logo cristaliza
      coreVis = ss(0.02, 0.12, p) * (1 - ss(0.56, 0.68, p))
      // ATERRIZAJE MEDIDO: el dock alcanza su estado FINAL en p=0.93 (el umbral
      // del brinco) y lo SOSTIENE, para que el lockup 3D quede exactamente donde
      // aparecerá el 2D de la página (medido en navegador: dy 54px, ratio 0.407).
      dockT = ss(0.78, 0.93, p)
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
      // ESTACIONAMIENTO: el logo sube y encoge hacia la cabeza (relevo al 2D del
      // hero de la página). Atado al scroll → smooth en ambos sentidos.
      // valores derivados de la medición: en dockT=1 el lockup 3D coincide en
      // posición y tamaño con el lockup 2D de la cabeza del contenido.
      grp.current.position.y = dockT * 1.058
      grp.current.scale.setScalar(BASE_SCALE * (1 - dockT * 0.4767))
    }

    // LOGO 3D — cristaliza con el polvo (mismo grupo/cámara → sin divergencia)
    const t = s.clock.elapsedTime
    if (logoMatRef.current) {
      const uo = logoMatRef.current.uniforms
      uo.uOpacity!.value += (logoOp - uo.uOpacity!.value) * (1 - Math.pow(0.02, dt))
      uo.uTime!.value = t
      uo.uShine!.value = 0.3
    }
    // ÓRBITAS (plano 2D pixel-perfect): opacidad = ringVis; "rejuego" = respiración sutil
    if (orbMatRef.current) orbMatRef.current.uniforms.uOpacity!.value += (ringVis - orbMatRef.current.uniforms.uOpacity!.value) * (1 - Math.pow(0.03, dt))
    if (orbMeshRef.current) orbMeshRef.current.scale.setScalar(1 + Math.sin(t * 0.7) * 0.006)
    // ASTEROIDES — cabalgan las elipses MEDIDAS del 2D con Kepler: el scroll
    // empuja el avance + deriva lenta. z = sin(E) teje delante/detrás del logo.
    const scroll = progressRef ? Math.min(1, Math.max(0, progressRef.current)) : 0
    const DEG = Math.PI / 180
    for (let i = 0; i < nodeMeshRefs.current.length; i++) {
      const nd = nodeMeshRefs.current[i]
      if (!nd?.mesh) continue
      const pa = PATHS[nd.path]!
      const M = nd.M0 + (scroll * 5.5 + t * 0.16) * nd.speed
      const E = solveKepler(M, nd.ecc)
      const cE = Math.cos(E), sE = Math.sin(E)
      const cph = Math.cos(pa.phi * DEG), sph = Math.sin(pa.phi * DEG)
      // punto sobre la elipse en coords de IMAGEN (y hacia abajo) → local (y arriba)
      const xi = pa.cx + pa.a * cE * cph - pa.b * sE * sph
      const yi = pa.cy + pa.a * cE * sph + pa.b * sE * cph
      nd.mesh.position.set((xi - 500) * PX, (281.5 - yi) * PX, sE * 0.3)
      nd.mesh.scale.setScalar(Math.max(0.0001, ringVis) * (nd.mesh.userData.s as number))
    }
    // NÚCLEO-MISTERIO: pulsa y respira; se funde al revelarse el logo
    if (coreMatRef.current) {
      const co = coreMatRef.current.uniforms
      co.uOpacity!.value += (coreVis - co.uOpacity!.value) * (1 - Math.pow(0.05, dt))
      co.uTime!.value = t
    }
    if (coreMeshRef.current) coreMeshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08)
    // vida: respiración sutil del lockup
    const breathe = 1 + Math.sin(t * 0.9) * 0.012
    if (logoMeshRef.current) logoMeshRef.current.scale.setScalar(breathe)
    // MEDICIÓN (dev): rect en pantalla del logo 3D, para alinear el aterrizaje
    // con el logo 2D de la página. Se apaga en producción.
    if (process.env.NODE_ENV !== 'production' && logoMeshRef.current) {
      const m = logoMeshRef.current
      const ws = m.getWorldScale(new THREE.Vector3()).x // incluye la escala del grupo
      const half = new THREE.Vector3(LOGO_WORLD_W / 2, LOGO_WORLD_W / logoAspect / 2, 0).multiplyScalar(ws)
      const c = m.getWorldPosition(new THREE.Vector3())
      const a = c.clone().sub(half).project(s.camera)
      const b2 = c.clone().add(half).project(s.camera)
      const W = s.size.width, H = s.size.height
      const x1 = (a.x * 0.5 + 0.5) * W, y1 = (1 - (a.y * 0.5 + 0.5)) * H
      const x2 = (b2.x * 0.5 + 0.5) * W, y2 = (1 - (b2.y * 0.5 + 0.5)) * H
      ;(window as unknown as { __logo3d?: unknown }).__logo3d = {
        cx: Math.round((x1 + x2) / 2), cy: Math.round((y1 + y2) / 2),
        w: Math.round(Math.abs(x2 - x1)), h: Math.round(Math.abs(y2 - y1)),
        p: +(progressRef?.current ?? 0).toFixed(3),
      }
    }
  })

  return (
    <group ref={grp}>
      <points geometry={sys.geo} material={sys.mat} frustumCulled={false} renderOrder={0} />

      {/* NÚCLEO-MISTERIO — el resplandor central que crea el campo de gravedad y
          que, al final, se revela como G1. Presente desde la entrada. */}
      <mesh ref={coreMeshRef} position={[0, 0, -0.12]} renderOrder={0}>
        <planeGeometry args={[2.8, 2.8]} />
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={LOGO_VERT}
          fragmentShader={CORE_FRAG}
          transparent
          depthWrite={false}
          depthTest={false}
          uniforms={{ uOpacity: { value: 0 }, uTime: { value: 0 } }}
        />
      </mesh>
      {/* LOGO — escribe profundidad (solo el cristal, por el discard) para que los
          aros que pasan por detrás queden ocultos (weaving real). */}
      {logoTex ? (
        <mesh ref={logoMeshRef} position={[0, 0, 0]} renderOrder={5}>
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

      {/* ÓRBITAS — el asset 2D como plano en la escena: posición y ángulos
          IDÉNTICOS al diseño estático, garantizado. Detrás del logo. */}
      {orbTex ? (
        <mesh ref={orbMeshRef} position={[0, 0, -0.05]} renderOrder={4}>
          <planeGeometry args={[ORB_W, ORB_H]} />
          <shaderMaterial
            ref={orbMatRef}
            vertexShader={LOGO_VERT}
            fragmentShader={ORB_FRAG}
            transparent
            depthWrite={false}
            depthTest={false}
            uniforms={{ uMap: { value: orbTex }, uOpacity: { value: 0 } }}
          />
        </mesh>
      ) : null}

      {/* ASTEROIDES — esferas de cristal sobre las elipses medidas del 2D;
          opacas con depth → tejen delante/detrás del logo (que escribe depth). */}
      {PATHS.map((pa, i) => {
        const base = PATHS.slice(0, i).reduce((s2, p2) => s2 + p2.asts.length, 0)
        return pa.asts.map((ast, k) => (
          <mesh
            key={`${i}-${k}`}
            ref={(m) => {
              if (m) m.userData.s = ast.s
              nodeMeshRefs.current[base + k] = { mesh: m, M0: ast.M0, speed: pa.speed, ecc: pa.ecc, path: i }
            }}
            scale={ast.s}
            renderOrder={6}
          >
            <sphereGeometry args={[1, 20, 20]} />
            <shaderMaterial
              vertexShader={RING_VERT}
              fragmentShader={NODE_FRAG}
              uniforms={{ uCol: { value: new THREE.Color(ast.c) } }}
            />
          </mesh>
        ))
      })}
    </group>
  )
}
