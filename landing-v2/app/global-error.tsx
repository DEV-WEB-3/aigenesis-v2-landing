'use client'

/**
 * Error en el propio layout raíz — el último recurso.
 *
 * Este componente SUSTITUYE al layout, así que tiene que traer sus propias
 * etiquetas `<html>` y `<body>`.
 *
 * ESTILOS EN LÍNEA A PROPÓSITO, y no por pereza: si lo que ha fallado es el
 * layout, la hoja de estilos puede ser exactamente lo que no ha cargado. Una
 * pantalla de último recurso que depende de un archivo externo puede acabar
 * siendo texto negro sin formato sobre blanco — que es peor que no tener nada,
 * porque parece que el sitio se ha roto del todo.
 *
 * Los colores van escritos aquí en vez de por token por la misma razón: las
 * variables CSS viven en la hoja que quizá no llegó. Es la única excepción
 * legítima a la regla de «ningún color a fuego», y por eso está documentada.
 *
 * NO SE TRADUCE, Y ES LA MISMA RAZÓN.
 *
 * Este componente SUSTITUYE al layout raíz, así que `IdiomaProvider` no existe
 * cuando se pinta: `useT` devolvería el español igualmente. Se podría leer el
 * idioma de `localStorage` y traer un diccionario mínimo, pero eso metería una
 * dependencia —y un modo de fallo más— justo en la pantalla cuyo único trabajo
 * es aparecer cuando todo lo demás ha fallado. Tres frases en español y un
 * botón que funciona valen más que once idiomas que quizá no lleguen a
 * dibujarse.
 *
 * Por eso `lang="es"` está bien puesto aquí: dice la verdad sobre lo que hay.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#02040a',
          color: '#f8fafc',
          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#9d4dff',
              margin: '0 0 1rem',
            }}
          >
            AiGenesis
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0 0 1rem',
            }}
          >
            No hemos podido cargar el sitio
          </h1>
          <p style={{ color: '#aab4c8', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
            Ha ocurrido un fallo al arrancar. Reintentar suele bastar.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              font: 'inherit',
              fontWeight: 600,
              padding: '0.7rem 1.6rem',
              borderRadius: '999px',
              border: 0,
              cursor: 'pointer',
              color: '#f8fafc',
              background: 'linear-gradient(95deg, #2962ff, #9d4dff)',
            }}
          >
            Reintentar
          </button>
          {error.digest ? (
            <p
              style={{
                marginTop: '1.5rem',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.75rem',
                color: '#5c6b82',
              }}
            >
              Referencia: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  )
}
