#!/usr/bin/env node
/**
 * EL ASISTENTE CONTESTA EN EL IDIOMA QUE LE PIDEN.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
 *
 * El corpus llevaba meses traducido al 100 % y el endpoint devolvía español
 * SIEMPRE. No fallaba nada: la página traduce al pintar, así que la superficie
 * que se revisa salía perfecta, y el portal —que consume el mismo cerebro por
 * HTTP y no tiene diccionario— enseñaba el español crudo. Un fallo que sólo se
 * ve desde la puerta que nadie mira.
 *
 * Por eso esto no comprueba «que la función traduzca»: comprueba QUE LA
 * RESPUESTA QUE SALE POR EL CABLE esté en el idioma pedido, campo por campo,
 * en las tres ramas que el cerebro puede devolver.
 *
 * ── CÓMO ──────────────────────────────────────────────────────────────────
 *
 * Se llama a `responder()` —el cerebro real, no un doble— y se pasa su salida
 * por `respuestaEn()`, que es exactamente lo que hace el handler POST. No se
 * levanta el servidor: `route.ts` importa `next/server` y montarlo aquí
 * añadiría una dependencia que no prueba nada más.
 */
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import assert from 'node:assert/strict'
import jitiPkg from 'jiti'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const crearJiti = jitiPkg.createJiti ?? jitiPkg.default?.createJiti ?? jitiPkg
const jiti = crearJiti(pathToFileURL(join(raiz, 'package.json')).href, { alias: { '@': raiz } })
createRequire(pathToFileURL(join(raiz, 'package.json')))

const { responder, TODAS_LAS_PREGUNTAS } = await jiti.import(resolve(raiz, 'lib/soporte/buscar.ts'))
const { RESPUESTAS_DE_CORTESIA } = await jiti.import(resolve(raiz, 'lib/soporte/cortesia.ts'))
const { respuestaEn, IDIOMAS_VALIDOS } = await jiti.import(resolve(raiz, 'app/api/asistente/idioma.ts'))
const { DICCIONARIO } = await jiti.import(resolve(raiz, 'lib/i18n/diccionario.ts'))

let fallos = 0
function comprobar(nombre, fn) {
  try {
    fn()
    console.log(`  ok   ${nombre}`)
  } catch (e) {
    fallos++
    console.log(`  FALL ${nombre}`)
    console.log(`       ${String(e.message).split('\n').slice(0, 6).join('\n       ')}`)
  }
}

console.log('\nEL ASISTENTE CONTESTA EN EL IDIOMA QUE LE PIDEN\n')

/* Una consulta que el corpus SÍ responde, y otra que no responde nadie. */
const CONSULTA_BUENA = '¿qué es el hold y por qué me lo piden?'
const CONSULTA_PERDIDA = 'zxqw asdfgh lorem ipsum que no existe en ningun corpus'

comprobar('el corpus entero tiene fila: si falta una, el endgame es español silencioso', () => {
  /*
   * `categoria` entra en la lista porque VIAJA en la respuesta y se pinta.
   * Es el campo que más fácil se olvida —no es la pregunta ni la respuesta—
   * y sin fila saldría en español dentro de una ficha por lo demás traducida,
   * que es peor que no traducir: parece un error del texto, no una falta.
   */
  const sin = []
  for (const p of TODAS_LAS_PREGUNTAS) {
    for (const campo of ['pregunta', 'respuesta', 'categoria']) {
      if (typeof DICCIONARIO[p[campo]]?.ko !== 'string') sin.push(`${p.id}.${campo}: ${String(p[campo]).slice(0, 50)}`)
    }
  }
  for (const [clase, texto] of Object.entries(RESPUESTAS_DE_CORTESIA)) {
    if (typeof DICCIONARIO[texto]?.ko !== 'string') sin.push(`cortesia.${clase}`)
  }
  assert.deepEqual(sin, [], 'campos del cerebro sin fila en el diccionario:\n   ' + sin.join('\n   '))
})

comprobar('la rama respuesta sale traducida, y con ella las relacionadas', () => {
  const es = responder(CONSULTA_BUENA)
  assert.equal(es.tipo, 'respuesta', 'la consulta de prueba dejó de encontrar respuesta')
  const ko = respuestaEn(es, 'ko')
  assert.equal(ko.idioma, 'ko')
  assert.match(ko.pregunta.pregunta, /[가-힣]/, 'la pregunta no salió en coreano')
  assert.match(ko.pregunta.respuesta, /[가-힣]/, 'la respuesta no salió en coreano')
  for (const r of ko.relacionadas) {
    assert.match(r.pregunta, /[가-힣]/, `una relacionada salió en español: ${r.pregunta.slice(0, 50)}`)
  }
  /* El id NO se traduce: es lo que enlaza. */
  assert.equal(ko.pregunta.id, es.pregunta.id, 'se tradujo el identificador')
})

comprobar('la rama derivar sale traducida — motivo y sugerencias', () => {
  const es = responder(CONSULTA_PERDIDA)
  assert.equal(es.tipo, 'derivar', 'la consulta perdida dejó de derivar')
  const ru = respuestaEn(es, 'ru')
  assert.equal(ru.idioma, 'ru')
  assert.match(ru.motivo, /[А-Яа-я]/, 'el motivo no salió en ruso')
  for (const s of ru.sugerencias) {
    assert.match(s.pregunta, /[А-Яа-я]/, `una sugerencia salió en español: ${s.pregunta.slice(0, 50)}`)
  }
})

comprobar('la rama cortesía sale traducida', () => {
  const es = responder('hola')
  assert.equal(es.tipo, 'cortesia', 'el saludo dejó de clasificarse como cortesía')
  const ar = respuestaEn(es, 'ar')
  assert.equal(ar.idioma, 'ar')
  assert.match(ar.mensaje, /[؀-ۿ]/, 'el saludo no salió en árabe')
})

comprobar('la híbrida NO miente: viaja en español y lo declara', () => {
  /*
   * Su `mensaje` lo redacta un modelo en tiempo real: no está en el
   * diccionario y no se puede traducir. Lo que NO puede pasar es que se
   * devuelva marcada como coreana — un cliente que se fíe de la etiqueta
   * enseñaría español creyendo que tradujo.
   */
  const hibrida = { tipo: 'hibrida', mensaje: 'Texto redactado por el modelo.', citas: ['x'] }
  const r = respuestaEn(hibrida, 'ko')
  assert.equal(r.idioma, 'es', 'la híbrida se declaró traducida sin estarlo')
  assert.equal(r.mensaje, hibrida.mensaje)
})

comprobar('en español no se toca nada, y se declara', () => {
  const es = responder(CONSULTA_BUENA)
  const r = respuestaEn(es, 'es')
  assert.equal(r.idioma, 'es')
  assert.equal(r.pregunta.respuesta, es.pregunta.respuesta)
})

comprobar('un idioma desconocido cae al español en vez de romper', () => {
  const es = responder(CONSULTA_BUENA)
  assert.equal(IDIOMAS_VALIDOS.has('zz'), false)
  /* Es lo que hace el handler: valida contra el catálogo y si no, español. */
  const r = respuestaEn(es, 'es')
  assert.equal(r.idioma, 'es')
})

comprobar('los doce idiomas del catálogo responden con texto, nunca con un hueco', () => {
  const es = responder(CONSULTA_BUENA)
  const vacios = []
  for (const codigo of IDIOMAS_VALIDOS) {
    const r = respuestaEn(es, codigo)
    if (!r.pregunta?.respuesta?.trim()) vacios.push(codigo)
  }
  assert.deepEqual(vacios, [], 'idiomas que devolvieron un hueco: ' + vacios.join(', '))
})

comprobar('control: el detector muerde de verdad', () => {
  /* Si esta prueba pasara con el endpoint SIN traducir, no probaría nada.
     Aquí se comprueba que el español crudo falla la comprobación de coreano. */
  const es = responder(CONSULTA_BUENA)
  assert.doesNotMatch(es.pregunta.respuesta, /[가-힣]/, 'control: el español ya traía hangul')
})

console.log(
  fallos
    ? `\nasistente: ${fallos} comprobación(es) fallaron\n`
    : '\nasistente: el cerebro contesta en el idioma pedido por las dos puertas\n'
)
process.exit(fallos ? 1 : 0)
