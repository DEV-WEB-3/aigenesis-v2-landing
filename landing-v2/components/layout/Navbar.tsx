'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Ecosistema', href: '#ecosistema' },
  { label: 'Token',      href: '#token' },
  { label: 'GPulse',     href: '#gpulse' },
  { label: 'Tienda',     href: '#tienda' },
  { label: 'Comunidad',  href: '#comunidad' },
]

function GenesisLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AiGenesis logo">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="url(#nav-logo-grad)" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="16" r="5" fill="url(#nav-logo-grad)" opacity="0.9" />
      <line x1="16" y1="2"  x2="16" y2="11" stroke="#8B5CF6" strokeWidth="0.8" opacity="0.6" />
      <line x1="28" y1="9"  x2="21" y2="13" stroke="#E91E8B" strokeWidth="0.8" opacity="0.6" />
      <line x1="28" y1="23" x2="21" y2="19" stroke="#8B5CF6" strokeWidth="0.8" opacity="0.6" />
      <line x1="16" y1="30" x2="16" y2="21" stroke="#E91E8B" strokeWidth="0.8" opacity="0.6" />
      <line x1="4"  y1="23" x2="11" y2="19" stroke="#8B5CF6" strokeWidth="0.8" opacity="0.6" />
      <line x1="4"  y1="9"  x2="11" y2="13" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <defs>
        <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8B5CF6" />
          <stop offset="55%"  stopColor="#E91E8B" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Escuchar scroll en el main (snap container), no en window
    const main = document.querySelector('main')
    if (!main) return
    const onScroll = () => setScrolled(main.scrollTop > 60)
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
      style={
        scrolled
          ? {
              background: 'rgba(10,14,20,0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(139,92,246,0.15)',
              pointerEvents: 'auto',
            }
          : { pointerEvents: 'auto' }
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo + nombre */}
        <a href="/" className="flex items-center gap-3 text-white no-underline">
          <GenesisLogo />
          <span
            className="text-lg font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(135deg, #8B5CF6, #E91E8B, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AiGenesis
          </span>
        </a>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 md:flex list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-white no-underline"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — magenta */}
        <button
          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #E91E8B)',
            fontFamily: 'var(--font-space-grotesk)',
            border: '1px solid rgba(233,30,139,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 16px rgba(233,30,139,0.5), 0 0 32px rgba(139,92,246,0.3)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'none'
          }}
        >
          Únete
        </button>
      </div>
    </motion.nav>
  )
}
