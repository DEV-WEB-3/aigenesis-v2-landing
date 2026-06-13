/**
 * Dev-only diagnostic: detecta HTML dev vs .next híbrido (build + dev).
 * NO recarga — la recarga no repara estado híbrido y enmascara la causa raíz.
 */
(function () {
  if (typeof window === 'undefined') return

  var REPAIR_CMD = 'npm run dev:repair'

  function isStaticAsset(url) {
    return typeof url === 'string' && url.indexOf('/_next/static/') !== -1
  }

  function reportChunk404(url) {
    if (window.__genesisChunk404Reported) return
    window.__genesisChunk404Reported = true
    console.error(
      '[dev-chunk-404] Chunk/CSS 404 — estado híbrido build+dev en .next.\n' +
        '  URL: ' +
        url +
        '\n' +
        '  Causa: npm run build sobrescribió .next mientras next dev seguía activo.\n' +
        '  Fix: detén next dev, borra .next, vuelve a arrancar:\n' +
        '    ' +
        REPAIR_CMD +
        '\n' +
        '  Prevención: prebuild ya detiene dev antes de build; no mezcles build + dev en paralelo.'
    )
  }

  window.addEventListener(
    'error',
    function (event) {
      var t = event.target
      if (!t || (t.tagName !== 'SCRIPT' && t.tagName !== 'LINK')) return
      var url = t.src || t.href
      if (!isStaticAsset(url)) return
      reportChunk404(url)
    },
    true
  )

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason
    var msg = reason && reason.message ? reason.message : String(reason || '')
    if (/ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(msg)) {
      reportChunk404(msg)
    }
  })
})()
