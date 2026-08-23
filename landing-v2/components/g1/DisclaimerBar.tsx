/**
 * DISCLAIMER BAR — el descargo persistente en superficies con contenido
 * financiero. EN ESPAÑOL A PROPÓSITO: es contenido sensible al dinero, y una
 * traducción imprecisa de «no es asesoría» cuesta caro (misma regla que el
 * whitepaper y el corpus de soporte). No pasa por i18n.
 */
export function DisclaimerBar({ className = '' }: { className?: string }) {
  return (
    <p
      lang="es"
      className={`font-mono text-[10.5px] leading-relaxed tracking-[0.04em] text-genesis-ghost ${className}`}
    >
      Informativo · no es asesoría financiera · participación voluntaria y con riesgos.
    </p>
  )
}
