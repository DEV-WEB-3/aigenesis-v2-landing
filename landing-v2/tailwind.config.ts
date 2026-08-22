import { EMISSION, INK, STATE, VOID } from './lib/design/tokens'
import { G1 } from './lib/design/g1'
import type { Config } from 'tailwindcss'

/**
 * AiGenesis V2 — Design Tokens (Genesis Brand)
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        genesis: {
          void: VOID.black,
          base: VOID.base,
          surface: VOID.surface,
          text: INK.base,
          ion: EMISSION.blueHi,
          cyan: EMISSION.cyan,
          pulse: EMISSION.blue,
          core: EMISSION.violet,
          mist: INK.muted,
          ghost: INK.faint,
          fuchsia: EMISSION.magenta,
          fuchsiaSoft: EMISSION.magentaHi,
          fuchsiaDeep: EMISSION.magenta,
          violet: EMISSION.violet,
          turquoise: EMISSION.cyan,
          legacy: {
            magenta: EMISSION.magenta,
            cyan: EMISSION.cyan,
          },
        },
        state: {
          success: STATE.success,
          warning: STATE.warning,
          error: STATE.error,
          info: EMISSION.blueHi,
        },
        webgl: {
          particleCore: EMISSION.cyan,
          particleEdge: EMISSION.violet,
          orbInner: VOID.raised,
          orbGlow: EMISSION.magenta,
          energyLine: 'rgba(233, 30, 139, 0.35)',
        },
        /* G1 — sub-marca de la alianza. Solo el acento propio; el resto hereda `genesis.*`. */
        g1: {
          amber: G1.amber,
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'JetBrains Mono',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      fontSize: {
        'display-xl': [
          'clamp(3.5rem, 8vw, 6rem)',
          { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '700' },
        ],
        display: [
          '3rem',
          { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        heading: [
          '2rem',
          { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        caption: [
          '0.75rem',
          { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '500' },
        ],
        mono: ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      spacing: {
        'genesis-1': '4px',
        'genesis-2': '8px',
        'genesis-3': '12px',
        'genesis-4': '16px',
        'genesis-6': '24px',
        'genesis-8': '32px',
        'genesis-12': '48px',
        'genesis-16': '64px',
        'genesis-24': '96px',
      },
      maxWidth: {
        prose: '720px',
        content: '1280px',
        ultrawide: '1440px',
      },
      screens: {
        tablet: '768px',
        desktop: '1024px',
        ultrawide: '1536px',
      },
      backgroundImage: {
        'gradient-brand':
          `linear-gradient(90deg, ${EMISSION.magenta} 0%, ${EMISSION.violet} 45%, ${EMISSION.blueHi} 100%)`,
        'gradient-intelligence':
          `linear-gradient(90deg, ${EMISSION.magenta} 0%, ${EMISSION.violet} 35%, ${EMISSION.blueHi} 70%, ${EMISSION.cyan} 100%)`,
        'gradient-genesis-signature':
          `linear-gradient(90deg, ${EMISSION.magenta} 0%, ${EMISSION.violet} 45%, ${EMISSION.blueHi} 100%)`,
        'gradient-genesis-strong':
          `linear-gradient(90deg, ${EMISSION.magenta} 0%, ${EMISSION.violet} 35%, ${EMISSION.blueHi} 70%, ${EMISSION.cyan} 100%)`,
        'gradient-fuchsia-core':
          `linear-gradient(90deg, ${EMISSION.magenta} 0%, ${EMISSION.violet} 100%)`,
        'gradient-legacy':
          `linear-gradient(90deg, ${EMISSION.blueHi} 0%, ${EMISSION.violet} 100%)`,
      },
      boxShadow: {
        'glow-brand': '0 0 24px rgba(233, 30, 139, 0.25), 0 0 32px rgba(61, 139, 255, 0.2)',
        'glow-brand-lg':
          '0 0 28px rgba(233, 30, 139, 0.25), 0 0 40px rgba(61, 139, 255, 0.2)',
        'glow-signature':
          '0 0 24px rgba(233, 30, 139, 0.25), 0 0 32px rgba(61, 139, 255, 0.2)',
        'glow-legacy': '0 0 24px rgba(233, 30, 139, 0.25), 0 0 32px rgba(61, 139, 255, 0.2)',
      },
      borderColor: {
        hairline: 'rgba(255, 255, 255, 0.08)',
        'hairline-strong': 'rgba(255, 255, 255, 0.14)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '600ms',
        cinematic: '900ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
