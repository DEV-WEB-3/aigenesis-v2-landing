'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/genesis'
import { GenesisOfficialLogo } from '@/components/brand'
import { useScene } from '@/context/SceneContext'
import { NAV_LINKS, ROUTES, sectionHref, resolveNavigationTarget, type SectionId } from '@/lib/routes'

const DRAWER_ID = 'mobile-nav-drawer'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollToSectionRef } = useScene()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const onScroll = () => setScrolled(main.scrollTop > 60)
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  useEffect(() => {
    const onHashChange = () => closeMenu()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [closeMenu])

  const navigateToSection = useCallback((id: SectionId) => {
    const target = resolveNavigationTarget(id)
    if (!target) return
    scrollToSectionRef.current?.(target.sectionIndex)
    window.history.replaceState(null, '', sectionHref(id))
    closeMenu()
  }, [scrollToSectionRef, closeMenu])

  const navLinkClass =
    'text-xs 2xl:text-sm text-genesis-mist transition-colors duration-200 hover:text-genesis-text no-underline font-display whitespace-nowrap focus-ring-genesis rounded-sm'

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="genesis-main-nav fixed top-0 left-0 right-0 z-50 px-5 sm:px-6 py-3 sm:py-4 transition-all duration-300"
        style={
          scrolled || menuOpen
            ? {
                background: 'rgba(10,14,20,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                pointerEvents: 'auto',
              }
            : { pointerEvents: 'auto' }
        }
        aria-label="Navegación principal"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a
            href={sectionHref('hero')}
            onClick={(e) => { e.preventDefault(); navigateToSection('hero') }}
            className="flex items-center gap-3 text-genesis-text no-underline shrink-0 focus-ring-signature rounded-sm"
            aria-label="GENESIS — Inicio"
          >
            <GenesisOfficialLogo size="sm" layout="horizontal" tone="color" className="hidden sm:inline-flex" />
            {/*
              `markScale` a un tercio porque este logo se PINTA a 36 px:
              `.genesis-nav-logo-mobile` lo baja a 2.25rem. Declaraba los 108 de
              `sm`, asi que a dpr 3 el navegador se llevaba la variante de 256 —
              15 KB para un icono de 36. Con el ancho real, Next genera el
              srcset desde sus tamanos pequenos y pide ~96.

              Lo intente antes con `sizes="36px"` y salio PEOR: cuando hay
              `sizes`, Next construye el srcset solo con `deviceSizes`, cuyo
              minimo es 640, y acabo pidiendo 750. La medida lo canto.
            */}
            <GenesisOfficialLogo size="sm" markScale={1 / 3} layout="vertical" tone="color" className="inline-flex sm:hidden genesis-nav-logo-mobile" />
          </a>

          <ul className="hidden xl:flex items-center gap-3 2xl:gap-4 list-none m-0 p-0 overflow-x-auto max-w-[58vw]">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={sectionHref(link.id)}
                  className={navLinkClass}
                  onClick={(e) => { e.preventDefault(); navigateToSection(link.id) }}
                >
                  {link.navLabel}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              href={ROUTES.REGISTER}
              className="hidden sm:inline-flex"
            >
              Únete
            </Button>

            <button
              ref={menuButtonRef}
              type="button"
              className="xl:hidden flex flex-col justify-center items-center w-11 h-11 rounded-full border border-hairline bg-genesis-surface/60 focus-ring-genesis"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls={DRAWER_ID}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className="block w-5 h-0.5 bg-genesis-text transition-transform duration-200"
                style={{ transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block w-5 h-0.5 bg-genesis-text my-1 transition-opacity duration-200"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-0.5 bg-genesis-text transition-transform duration-200"
                style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-genesis-void/80 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
              onClick={closeMenu}
            />

            <motion.aside
              id={DRAWER_ID}
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm flex flex-col bg-genesis-base border-l border-hairline xl:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
                <GenesisOfficialLogo size="sm" layout="horizontal" tone="color" />
                <button
                  type="button"
                  className="w-10 h-10 rounded-full text-genesis-mist hover:text-genesis-text focus-ring-genesis"
                  aria-label="Cerrar menú"
                  onClick={closeMenu}
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Enlaces del menú">
                <ul className="flex flex-col gap-1 list-none m-0 p-0">
                  <li>
                    <a
                      href={sectionHref('hero')}
                      className="block py-3 text-base font-display text-genesis-mist hover:text-genesis-text no-underline border-b border-hairline focus-ring-genesis rounded-sm"
                      onClick={(e) => { e.preventDefault(); navigateToSection('hero') }}
                    >
                      Inicio
                    </a>
                  </li>
                  {NAV_LINKS.map((link) => (
                    <li key={link.id}>
                      <a
                        href={sectionHref(link.id)}
                        className="block py-3 text-base font-display text-genesis-mist hover:text-genesis-text no-underline border-b border-hairline focus-ring-genesis rounded-sm"
                        onClick={(e) => { e.preventDefault(); navigateToSection(link.id) }}
                      >
                        {link.navLabel}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={ROUTES.REGISTER}
                      className="block py-3 text-base font-display text-genesis-ion hover:text-genesis-text no-underline focus-ring-genesis rounded-sm"
                      onClick={closeMenu}
                    >
                      Únete
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="px-6 py-6 border-t border-hairline">
                <Button variant="primary" size="lg" href={ROUTES.REGISTER} className="w-full justify-center">
                  Crear cuenta
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
