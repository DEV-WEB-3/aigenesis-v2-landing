import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = 'C:\\Users\\user\\AppData\\Local\\Temp\\claude\\C--Users-user\\0a459d37-bfce-43ab-8a8a-f734c2ed4afd\\scratchpad\\aitech-inventory.json'
const PAGES = {
  home: 'https://aitechone.io/',
  sobre: 'https://aitechone.io/sobre-aitech-one',
  'como-funciona': 'https://aitechone.io/como-funciona',
  ecosistema: 'https://aitechone.io/ecosistema',
  eventos: 'https://aitechone.io/eventos',
  faq: 'https://aitechone.io/preguntas-frecuentes',
}
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1200 })
const assets = new Map() // url -> {url, type, pages:Set, alts:Set}
function add(url, type, pageKey, alt) {
  if (!url || !url.startsWith('http')) return
  const clean = url.split('?')[0]
  if (!assets.has(clean)) assets.set(clean, { url: clean, type, pages: new Set(), alts: new Set() })
  const a = assets.get(clean)
  a.pages.add(pageKey)
  if (alt) a.alts.add(alt.slice(0, 60))
}
for (const [key, url] of Object.entries(PAGES)) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => console.log('goto', key, e.message))
  // scroll para forzar lazy-load
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)) }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 1500))
  const found = await page.evaluate(() => {
    const vids = []
    document.querySelectorAll('video').forEach((v) => {
      const src = v.currentSrc || v.src || (v.querySelector('source') && v.querySelector('source').src) || ''
      vids.push({ src, poster: v.poster || '' })
    })
    const imgs = []
    document.querySelectorAll('img').forEach((im) => { if (im.src) imgs.push({ src: im.src, alt: im.alt || '' }) })
    const res = performance.getEntriesByType('resource').map((r) => r.name)
    const mediaRes = res.filter((n) => /\.(mp4|webm|mov|jpg|jpeg|png|webp|svg|avif)(\?|$)/i.test(n) && n.includes('aitechone.io'))
    return { vids, imgs, mediaRes }
  })
  found.vids.forEach((v) => { add(v.src, 'video', key); add(v.poster, 'poster', key) })
  found.imgs.forEach((im) => add(im.src, 'image', key, im.alt))
  found.mediaRes.forEach((r) => { const t = /\.(mp4|webm|mov)/i.test(r) ? 'video' : 'image'; add(r, t, key) })
  console.log(key, '-> vids', found.vids.length, 'imgs', found.imgs.length, 'res', found.mediaRes.length)
}
const inv = [...assets.values()].map((a) => ({ url: a.url, type: a.type, path: a.url.replace('https://aitechone.io', ''), pages: [...a.pages], alts: [...a.alts] }))
inv.sort((a, b) => a.path.localeCompare(b.path))
writeFileSync(OUT, JSON.stringify(inv, null, 1))
console.log('\nTOTAL', inv.length, 'assets ·', inv.filter((x) => x.type === 'video').length, 'videos ·', inv.filter((x) => x.type === 'poster').length, 'posters ·', inv.filter((x) => x.type === 'image').length, 'images')
console.log('inventory ->', OUT)
await browser.close()
