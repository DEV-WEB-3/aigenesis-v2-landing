/** Dev: siempre ON. Prod: localStorage.setItem('hero-debug','1') */
export const HERO_DEBUG =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.localStorage?.getItem('hero-debug') === '1')

declare global {
  interface Window {
    __HERO_LOGS?: Array<{ tag: string; data?: Record<string, unknown>; t: number }>
  }
}

export function heroDebug(tag: string, data?: Record<string, unknown>) {
  if (!HERO_DEBUG) return
  const entry = { tag, data, t: typeof performance !== 'undefined' ? performance.now() : 0 }
  console.log(`[HeroDebug:${tag}]`, data ?? '')
  if (typeof window !== 'undefined') {
    window.__HERO_LOGS = window.__HERO_LOGS ?? []
    window.__HERO_LOGS.push(entry)
    if (window.__HERO_LOGS.length > 300) window.__HERO_LOGS.shift()
  }
}
