/** Ejecutar lo antes posible en <head> — antes que wallets inyecten injected.js */
export const WALLET_EXTENSION_GUARD_SCRIPT = `
(function () {
  var NOISE_RE = /tronlinkParams|TronLink|injected\\.js|contentscript|proxy-injected|metamask|moz-extension:|chrome-extension:/i;

  function isWalletExtensionNoise(reason, message, source) {
    var text = [
      reason && reason.message ? reason.message : String(reason || ''),
      reason && reason.stack ? reason.stack : '',
      message || '',
      source || '',
    ].join('\\n');
    return NOISE_RE.test(text);
  }

  function swallowExtensionNoise(event) {
    if (!event) return false;
    var reason = event.reason || event.error;
    var source = event.filename || (event.target && event.target.src) || '';
    if (!isWalletExtensionNoise(reason, event.message, source)) return false;
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }

  window.addEventListener('unhandledrejection', swallowExtensionNoise, true);

  window.addEventListener('error', function (event) {
    swallowExtensionNoise(event);
  }, true);

  var prevOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (isWalletExtensionNoise(error, message, source)) return true;
    if (typeof prevOnError === 'function') {
      return prevOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  /* Evita 400 en dev overlay cuando intenta mapear stack de chrome-extension:// */
  if (typeof window.fetch === 'function') {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (
        url.indexOf('__nextjs_original-stack-frame') !== -1 &&
        (url.indexOf('chrome-extension') !== -1 || url.indexOf('moz-extension') !== -1)
      ) {
        return Promise.resolve(
          new Response('{"status":"blocked-extension-frame"}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      return origFetch.apply(this, arguments);
    };
  }
})();
`
