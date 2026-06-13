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
          void: '#02040A',
          base: '#080A14',
          surface: '#0F111C',
          text: '#F8FAFC',
          ion: '#3D8BFF',
          cyan: '#22D3EE',
          pulse: '#5B6CFF',
          core: '#6E56CF',
          mist: '#AAB4C8',
          ghost: '#5C6B82',
          fuchsia: '#E91E8B',
          fuchsiaSoft: '#FF4FB8',
          fuchsiaDeep: '#C4187A',
          violet: '#6E56CF',
          turquoise: '#22D3EE',
          legacy: {
            magenta: '#E91E8B',
            cyan: '#22D3EE',
          },
        },
        state: {
          success: '#2FD07F',
          warning: '#E6B450',
          error: '#E85D5D',
          info: '#3D8BFF',
        },
        webgl: {
          particleCore: '#22D3EE',
          particleEdge: '#6E56CF',
          orbInner: '#1A2744',
          orbGlow: '#E91E8B',
          energyLine: 'rgba(233, 30, 139, 0.35)',
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
          'linear-gradient(90deg, #E91E8B 0%, #6E56CF 45%, #3D8BFF 100%)',
        'gradient-intelligence':
          'linear-gradient(90deg, #E91E8B 0%, #6E56CF 35%, #3D8BFF 70%, #22D3EE 100%)',
        'gradient-genesis-signature':
          'linear-gradient(90deg, #E91E8B 0%, #6E56CF 45%, #3D8BFF 100%)',
        'gradient-genesis-strong':
          'linear-gradient(90deg, #E91E8B 0%, #6E56CF 35%, #3D8BFF 70%, #22D3EE 100%)',
        'gradient-fuchsia-core':
          'linear-gradient(90deg, #E91E8B 0%, #6E56CF 100%)',
        'gradient-legacy':
          'linear-gradient(90deg, #3D8BFF 0%, #6E56CF 100%)',
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
