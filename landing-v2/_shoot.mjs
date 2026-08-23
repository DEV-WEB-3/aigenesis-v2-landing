import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = 'C:\\Users\\user\\AppData\\Local\\Temp\\claude\\C--Users-user\\0a459d37-bfce-43ab-8a8a-f734c2ed4afd\\scratchpad\\'
const url = process.argv[2] || 'http://localhost:3000/g1/narrativa'
const fracs = (process.argv[3] || '0,0.14,0.3,0.46,0.62,0.75,0.9').split(',').map(Number)
const prefix = process.argv[4] || 'narr'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox', '--enable-webgl', '--ignore-gpu-blocklist',
    '--enable-unsafe-swiftshader', '--use-gl=angle', '--window-size=1440,900',
  ],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text().slice(0, 160)) })
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)))

await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => console.log('goto:', e.message))
await sleep(2500)
const info = await page.evaluate(() => ({
  canvas: !!document.querySelector('canvas'),
  h: document.body.scrollHeight, ih: window.innerHeight,
}))
console.log('info', JSON.stringify(info))

for (let i = 0; i < fracs.length; i++) {
  const f = fracs[i]
  await page.evaluate((f) => { window.scrollTo(0, f * (document.body.scrollHeight - window.innerHeight)) }, f)
  await sleep(1700)
  const y = await page.evaluate(() => Math.round(window.scrollY))
  const file = `${OUT}${prefix}-${String(i)}-f${f}.png`
  await page.screenshot({ path: file })
  console.log(`shot ${i} frac=${f} scrollY=${y} -> ${file}`)
}
console.log('ERRORS:', errors.length ? errors.slice(0, 12).join('\n') : 'none')
await browser.close()
