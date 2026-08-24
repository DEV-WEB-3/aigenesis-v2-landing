import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = process.argv[2] || '3000'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader', '--window-size=1440,900'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto(`http://localhost:${PORT}/g1`, { waitUntil: 'networkidle2', timeout: 120000 }).catch(e => console.log('goto', e.message))
await sleep(3500)
const ok = await p.evaluate(() => getComputedStyle(document.querySelector('header')).position)
console.log('instrumento (header):', ok)
const geo = await p.evaluate(() => { const w = document.querySelector('div[style*="620vh"]'); return { top: Math.round(w.getBoundingClientRect().top + window.scrollY), h: w.offsetHeight, vh: window.innerHeight } })
const yOf = (pp) => Math.round(geo.top + pp * (geo.h - geo.vh))
const pOf = (y) => (y - geo.top) / (geo.h - geo.vh)

// === A) MAGNETISMO: soltar en zona muerta → debe asentarse en el acto cercano
const CENTERS = [0.06, 0.21, 0.37, 0.53, 0.71, 0.915]
for (const test of [0.27, 0.45, 0.61]) {
  await p.evaluate((y) => window.scrollTo(0, y), yOf(test))
  await sleep(2200) // deja pasar el debounce (160ms) + el glide (750ms)
  const now = pOf(await p.evaluate(() => window.scrollY))
  let near = CENTERS[0]; for (const c of CENTERS) if (Math.abs(c - now) < Math.abs(near - now)) near = c
  console.log(`magnetismo: soltado en p=${test} → quedó en p=${now.toFixed(3)} | acto más cercano ${near} | ${Math.abs(now - near) < 0.02 ? 'ASENTÓ ✓' : 'no asentó ✗'}`)
}

// === B) BRINCO FINAL: un scroll más cerca del final → cae en el contenido
await p.evaluate((y) => window.scrollTo(0, y), yOf(0.945))
await sleep(1800)
const before = await p.evaluate(() => Math.round(window.scrollY))
await p.mouse.move(700, 450)
await p.mouse.wheel({ deltaY: 260 })
await sleep(2600)
const after = await p.evaluate(() => Math.round(window.scrollY))
const target = await p.evaluate(() => { const w = document.querySelector('div[style*="620vh"]'); return Math.round(w.nextElementSibling.getBoundingClientRect().top + window.scrollY) - 72 })
console.log(`brinco: ${before} → ${after} | objetivo ${target} | error ${Math.abs(after - target)}px | ${Math.abs(after - target) < 6 ? 'CAYÓ ✓' : 'falló ✗'}`)

// === C) SCROLL NORMAL dentro de la página (sin magnetismo ni brincos)
const y1 = await p.evaluate(() => { window.scrollBy(0, 400); return 0 })
await sleep(1800)
const y2 = await p.evaluate(() => Math.round(window.scrollY))
console.log(`scroll normal tras aterrizar: ${after} → ${y2} (delta ${y2 - after}px, esperado ~400) | ${Math.abs(y2 - after - 400) < 120 ? 'LIBRE ✓' : 'interferido ✗'}`)
await b.close()
