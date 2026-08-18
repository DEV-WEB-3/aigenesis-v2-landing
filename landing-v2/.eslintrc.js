/*
 * Era `.eslintrc.json`. Cambio a `.js` porque el motivo de la excepcion de abajo
 * estaba guardado como una clave `_razon` dentro del JSON, y ESLint rechaza
 * claves que no reconoce: la configuracion entera quedaba invalida y NINGUNA de
 * estas reglas se ejecutaba. El build seguia pasando, en verde, sin puerta.
 *
 * JSON no admite comentarios; este archivo si. El motivo va donde debe ir.
 */
module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
        message:
          'Color a fuego. Usa un token de @/lib/design/tokens (EMISSION, VOID, INK, STATE). Antes de esta regla habia 50 colores distintos en 372 apariciones y tres sistemas de color compitiendo; la regla existe para que eso no pueda volver.',
      },
      {
        selector: 'TemplateElement[value.raw=/#(?:[0-9a-fA-F]{6})/]',
        message: 'Color a fuego dentro de una plantilla. Interpola el token: ${EMISSION.magenta}.',
      },
    ],
  },
  overrides: [
    {
      files: ['lib/design/tokens.ts', 'scripts/**'],
      rules: { 'no-restricted-syntax': 'off' },
    },
    {
      /*
       * global-error.tsx SUSTITUYE al layout raiz, asi que se muestra justo
       * cuando la hoja de estilos puede no haber cargado. Usar var(--g-*) ahi
       * arriesga texto sin formato sobre blanco, que es peor que no tener
       * pantalla de error. Es la UNICA excepcion legitima a la regla, y por eso
       * esta acotada a un solo archivo.
       */
      files: ['app/global-error.tsx'],
      rules: { 'no-restricted-syntax': 'off' },
    },
  ],
}
