/**
 * Barrido de color: de hex a fuego a tokens gobernados.
 *
 * POR QUE UN SCRIPT Y NO A MANO
 * -----------------------------
 * Son 372 apariciones de 50 colores en decenas de archivos. A mano se olvida
 * alguno — y ya pasó: así aparecieron `#9B4DFF` y `#FF2EDB`, que difieren del
 * canónico en 0 y 2 grados de tono. No son decisiones de diseño, son erratas de
 * copiar y pegar que sobrevivieron porque nadie las podía ver de golpe.
 *
 * QUE HACE
 * --------
 *  .css   → sustituye el hex por `var(--g-...)`
 *  .ts/.tsx → sustituye el hex por la constante del token, e inserta el import
 *
 * QUE NO HACE
 * -----------
 * No toca los hex sin destino en el mapa (marcados `null`): esos se revisan
 * caso por caso. Tampoco toca `lib/design/tokens.ts`, que es la fuente.
 *
 * Uso:  node scripts/migrate-colors.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const RAIZ = process.cwd()
const SECO = process.argv.includes('--dry')

/** hex canónico → { css: nombre de variable, ts: expresión del token } */
const MAPA = {
  '#FF00C8': { css: 'g-magenta', ts: 'EMISSION.magenta' },
  '#E91E8B': { css: 'g-magenta', ts: 'EMISSION.magenta' },
  '#FF4DDB': { css: 'g-magenta-hi', ts: 'EMISSION.magentaHi' },
  '#FF2EDB': { css: 'g-magenta-hi', ts: 'EMISSION.magentaHi' },
  '#FF4FB8': { css: 'g-magenta-hi', ts: 'EMISSION.magentaHi' },
  '#C4187A': { css: 'g-magenta', ts: 'EMISSION.magenta' },
  '#9D4DFF': { css: 'g-violet-hi', ts: 'EMISSION.violetHi' },
  '#9B4DFF': { css: 'g-violet-hi', ts: 'EMISSION.violetHi' },
  '#7C3AED': { css: 'g-violet', ts: 'EMISSION.violet' },
  '#6E56CF': { css: 'g-violet', ts: 'EMISSION.violet' },
  '#2962FF': { css: 'g-blue', ts: 'EMISSION.blue' },
  '#5B6CFF': { css: 'g-blue', ts: 'EMISSION.blue' },
  '#1E4A8A': { css: 'g-blue', ts: 'EMISSION.blue' },
  '#3D8BFF': { css: 'g-blue-hi', ts: 'EMISSION.blueHi' },
  '#3B82F6': { css: 'g-blue-hi', ts: 'EMISSION.blueHi' },
  '#2D70E0': { css: 'g-blue-hi', ts: 'EMISSION.blueHi' },
  '#7B9CFF': { css: 'g-blue-hi', ts: 'EMISSION.blueHi' },
  '#00F5FF': { css: 'g-cyan', ts: 'EMISSION.cyan' },
  '#22D3EE': { css: 'g-cyan', ts: 'EMISSION.cyan' },
  '#00E5FF': { css: 'g-cyan', ts: 'EMISSION.cyan' },
  '#00D1FF': { css: 'g-cyan', ts: 'EMISSION.cyan' },
  '#00BCD4': { css: 'g-cyan', ts: 'EMISSION.cyan' },
  '#A5F3FC': { css: 'g-cyan', ts: 'EMISSION.cyan' },
  '#2FD07F': { css: 'g-success', ts: 'STATE.success' },
  '#5CE1A0': { css: 'g-success', ts: 'STATE.success' },
  '#E6B450': { css: 'g-warning', ts: 'STATE.warning' },
  '#E8C547': { css: 'g-warning', ts: 'STATE.warning' },
  '#FFB347': { css: 'g-warning', ts: 'STATE.warning' },
  '#E85D5D': { css: 'g-error', ts: 'STATE.error' },
  '#02040A': { css: 'g-void', ts: 'VOID.black' },
  '#05070D': { css: 'g-void', ts: 'VOID.black' },
  '#030711': { css: 'g-void', ts: 'VOID.black' },
  '#050510': { css: 'g-void', ts: 'VOID.black' },
  '#080A14': { css: 'g-base', ts: 'VOID.base' },
  '#0F111C': { css: 'g-surface', ts: 'VOID.surface' },
  '#0F172A': { css: 'g-surface', ts: 'VOID.surface' },
  '#1A2744': { css: 'g-raised', ts: 'VOID.raised' },
  '#F8FAFC': { css: 'g-ink', ts: 'INK.base' },
  '#F8FBFF': { css: 'g-ink', ts: 'INK.base' },
  '#AAB4C8': { css: 'g-ink-muted', ts: 'INK.muted' },
  '#8B97AD': { css: 'g-ink-muted', ts: 'INK.muted' },
  '#94A3B8': { css: 'g-ink-muted', ts: 'INK.muted' },
  '#CBD5E1': { css: 'g-ink-muted', ts: 'INK.muted' },
  '#E2E8F0': { css: 'g-ink-muted', ts: 'INK.muted' },
  '#5C6B82': { css: 'g-ink-faint', ts: 'INK.faint' },
}

/** No se tocan: son la fuente, o son casos a revisar a mano. */
const EXCLUIR = new Set(['lib/design/tokens.ts', 'scripts/migrate-colors.mjs'])
const SIN_DESTINO = new Set(['#FFFFFF', '#FFF', '#DCE6FF', '#E8F0FF', '#E8F4FF', '#FFF5F0'])

function archivos(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'backup', 'docs', 'public'].includes(n)) continue
    const p = join(dir, n)
    if (statSync(p).isDirectory()) archivos(p, acc)
    else if (['.ts', '.tsx', '.css'].includes(extname(n))) acc.push(p)
  }
  return acc
}

const stats = { archivos: 0, css: 0, jsx: 0, cadena: 0, dentro: 0, definiciones: 0, saltados: 0 }
const tocados = []

for (const p of archivos(RAIZ)) {
  const rel = relative(RAIZ, p).replace(/\\/g, '/')
  if (EXCLUIR.has(rel)) continue

  const original = readFileSync(p, 'utf8')
  let txt = original
  const esCss = extname(p) === '.css'
  const usados = new Set()

  const token = (hex) => {
    const canon = hex.toUpperCase()
    if (SIN_DESTINO.has(canon)) return null
    return MAPA[canon] ?? null
  }

  if (esCss) {
    /*
     * NO TOCAR LA LINEA QUE DEFINE UN TOKEN.
     *
     * La primera version de este script si lo hacia, y el resultado fue
     * `--g-magenta: var(--g-magenta)` — una variable que se referencia a si
     * misma. CSS la considera invalida en silencio: no falla el build, no sale
     * en consola, simplemente resuelve a nada. Se llevo por delante los catorce
     * tokens y con ellos todo el texto en degradado, que quedo transparente
     * sobre fondo transparente.
     *
     * El codemod se habia comido su propia fuente. Se excluyo `tokens.ts` por
     * ser la fuente en TypeScript, pero el bloque `:root` es exactamente lo
     * mismo en CSS y no estaba excluido.
     */
    txt = txt.replace(/^(\s*--[a-z0-9-]+\s*:\s*)(#[0-9A-Fa-f]{3,8})(\s*;)/gm, (m) => {
      stats.definiciones++
      return m
    })
    const esDefinicion = (linea) => /^\s*--[a-z0-9-]+\s*:/.test(linea)
    txt = txt
      .split('\n')
      .map((linea) => {
        if (esDefinicion(linea)) return linea
        return linea.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => {
          const d = token(m)
          if (!d) { stats.saltados++; return m }
          stats.css++
          return `var(--${d.css})`
        })
      })
      .join('\n')
  } else {
    /*
     * El hex vive en TRES contextos y cada uno necesita otra sintaxis. Tratarlos
     * igual produce codigo que no compila — o peor, que compila y pinta el
     * nombre del token como texto.
     */

    // 1. atributo JSX:  stopColor="#FF00C8"  ->  stopColor={EMISSION.magenta}
    txt = txt.replace(/(\w+)=(["'])(#[0-9A-Fa-f]{6})\2/g, (m, attr, _q, hex) => {
      const d = token(hex)
      if (!d) { stats.saltados++; return m }
      stats.jsx++
      usados.add(d.ts.split('.')[0])
      return `${attr}={${d.ts}}`
    })

    // 2. la cadena ES el hex entero:  color: '#9D4DFF'  ->  color: EMISSION.violetHi
    txt = txt.replace(/(["'])(#[0-9A-Fa-f]{6})\1/g, (m, _q, hex) => {
      const d = token(hex)
      if (!d) { stats.saltados++; return m }
      stats.cadena++
      usados.add(d.ts.split('.')[0])
      return d.ts
    })

    // 3. hex DENTRO de una cadena mas larga:
    //    'linear-gradient(90deg, #E91E8B 0%)'  ->  `linear-gradient(90deg, ${EMISSION.magenta} 0%)`
    //    Hay que convertir la cadena a plantilla; si no, el token queda como texto.
    txt = txt.replace(/(["'])((?:[^"'\\\n]|\\.)*#[0-9A-Fa-f]{6}(?:[^"'\\\n]|\\.)*)\1/g, (m, q, cuerpo) => {
      if (!/#[0-9A-Fa-f]{6}/.test(cuerpo)) return m
      if (cuerpo.includes('`') || cuerpo.includes('${')) return m // no tocar: ya es raro
      let alguno = false
      const nuevo = cuerpo.replace(/#[0-9A-Fa-f]{6}\b/g, (hex) => {
        const d = token(hex)
        if (!d) return hex
        alguno = true
        stats.dentro++
        usados.add(d.ts.split('.')[0])
        return '${' + d.ts + '}'
      })
      if (!alguno) return m
      return '`' + nuevo + '`'
    })

    if (usados.size && !txt.includes("from '@/lib/design/tokens'")) {
      const imp = `import { ${[...usados].sort().join(', ')} } from '@/lib/design/tokens'\n`
      const m = txt.match(/^(?:'use client'\n+)?(?:\/\*[\s\S]*?\*\/\n+)?/)
      const corte = m ? m[0].length : 0
      txt = txt.slice(0, corte) + imp + txt.slice(corte)
    }
  }

  if (txt !== original) {
    stats.archivos++
    tocados.push(rel)
    if (!SECO) writeFileSync(p, txt, 'utf8')
  }
}

console.log(`${SECO ? '[SIMULACION] ' : ''}archivos tocados: ${stats.archivos}`)
console.log(`  css  -> var(--token) ........ ${stats.css}`)
console.log(`  jsx  -> attr={TOKEN} ........ ${stats.jsx}`)
console.log(`  cadena completa -> TOKEN .... ${stats.cadena}`)
console.log(`  dentro de cadena -> \${} .... ${stats.dentro}`)
console.log(`  sin destino (intactos) ...... ${stats.saltados}`)
console.log('\narchivos:')
for (const t of tocados) console.log('  ' + t)
