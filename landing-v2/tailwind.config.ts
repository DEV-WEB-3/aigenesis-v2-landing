import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        genesis: {
          // Dominantes (80% del color visible)
          violet:       '#8B5CF6',   // 50% — color principal
          magenta:      '#E91E8B',   // 30% — firma, botones, labels
          // Transición
          blue:         '#3B82F6',   // 10%
          // Remate luminoso (máx 20%)
          cyan:         '#00E5FF',   // 10-20% — SOLO rim glow + pocas partículas
          // Fondos
          base:         '#0A0E14',   // negro profundo
          'base-light': '#111827',
          // Interior orb
          'deep-violet':'#4C1D95',
          // Texto
          muted:        '#94A3B8',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'genesis-gradient': 'linear-gradient(135deg, #00E5FF, #7C3AED)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,229,255,0.3), 0 0 40px rgba(0,229,255,0.15)',
        'glow-violet': '0 0 20px rgba(124,58,237,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
