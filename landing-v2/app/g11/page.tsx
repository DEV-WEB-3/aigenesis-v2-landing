import type { Metadata } from 'next'
import StaticPageShell from '@/components/layout/StaticPageShell'
import { Button } from '@/components/ui/genesis'
import { ROUTES } from '@/lib/routes'
import { PRESENTACIONES_G11, GUIAS_G11, CANALES_G11, MB_PESADO } from '@/lib/g11'

export const metadata: Metadata = {
  title: 'Comunidad G11 — AiGenesis',
  description:
    'Material oficial de la Comunidad G11: guías de registro y minería, presentaciones corporativas en ocho idiomas y canales oficiales.',
  alternates: { canonical: '/g11' },
}

export default function G11Page() {
  return (
    <StaticPageShell title="Comunidad G11">
      <p className="text-genesis-text font-medium">
        El material con el que se crece: guías, presentaciones oficiales y los canales donde
        está la comunidad.
      </p>

      {/* ── Guías ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="g11-guias">
        <h2 id="g11-guias" className="font-display text-heading text-genesis-text mb-1">
          Guías
        </h2>
        <p className="text-body text-genesis-ghost mb-4">
          Los cuatro pasos, de la cuenta nueva a la oficina virtual.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none m-0 p-0">
          {GUIAS_G11.map((guia) => {
            const contenido = (
              <>
                <span className="font-display text-body-lg text-genesis-text">{guia.titulo}</span>
                <span className="text-body text-genesis-mist">{guia.descripcion}</span>
                {/*
                  La etiqueta de «en el canal» sólo aparece si NO hay vídeo
                  propio. En cuanto se rellene la URL en `lib/g11.ts`, la ficha
                  se convierte en enlace y esta línea desaparece sola — no hay
                  que acordarse de venir a borrarla.
                */}
                {guia.video ? null : (
                  <span className="text-caption text-genesis-ghost uppercase tracking-wider">
                    Disponible en el canal
                  </span>
                )}
              </>
            )

            return (
              <li key={guia.titulo}>
                {guia.video ? (
                  <a
                    href={guia.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card card-genesis-hover focus-ring-genesis rounded-2xl p-genesis-6 flex flex-col gap-2 no-underline h-full"
                  >
                    {contenido}
                  </a>
                ) : (
                  <div className="surface-card rounded-2xl p-genesis-6 flex flex-col gap-2 h-full">
                    {contenido}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <div className="pt-4">
          <Button
            variant="secondary"
            size="md"
            href={CANALES_G11.find((c) => c.nombre === 'YouTube')!.url}
          >
            Ver las guías en YouTube
          </Button>
        </div>
      </section>

      {/* ── Presentaciones ────────────────────────────────────────────── */}
      <section aria-labelledby="g11-presentaciones">
        <h2 id="g11-presentaciones" className="font-display text-heading text-genesis-text mb-1">
          Presentaciones oficiales
        </h2>
        <p className="text-body text-genesis-ghost mb-4">
          La presentación corporativa, en ocho idiomas. El peso va indicado: una de ellas es muy
          grande y conviene saberlo antes de descargarla con datos.
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none m-0 p-0">
          {PRESENTACIONES_G11.map((p) => (
            <li key={p.idioma}>
              <a
                href={p.archivo}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card card-genesis-hover focus-ring-genesis rounded-2xl px-genesis-4 py-genesis-4 flex flex-col gap-1 no-underline h-full"
              >
                <span className="font-display text-body-lg text-genesis-text">{p.nativo}</span>
                <span
                  className={`text-caption uppercase tracking-wider ${
                    p.mb >= MB_PESADO ? 'text-state-warning' : 'text-genesis-ghost'
                  }`}
                >
                  PDF · {p.mb} MB
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Canales ───────────────────────────────────────────────────── */}
      <section aria-labelledby="g11-canales">
        <h2 id="g11-canales" className="font-display text-heading text-genesis-text mb-1">
          Canales oficiales
        </h2>
        <p className="text-body text-genesis-ghost mb-4">
          Los canales de la comunidad G11. Son distintos de los de AiGenesis.
        </p>

        <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
          {CANALES_G11.map((c) => (
            <li key={c.nombre}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-11 px-5 rounded-full border border-hairline text-body text-genesis-mist hover:text-genesis-text hover:border-genesis-ion no-underline transition-base focus-ring-genesis"
              >
                {c.nombre}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Alta ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="g11-alta" className="pt-2">
        <h2 id="g11-alta" className="font-display text-heading text-genesis-text mb-1">
          Empezar
        </h2>
        <p className="text-body text-genesis-mist mb-4">
          El alta necesita el enlace de tu patrocinador y una cartera Web3. Si aún no tienes
          patrocinador, escribe por cualquiera de los canales de arriba.
        </p>
        <Button variant="signature" size="lg" href={ROUTES.REGISTER}>
          Crear cuenta
        </Button>
      </section>
    </StaticPageShell>
  )
}
