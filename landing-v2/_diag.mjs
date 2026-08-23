import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--use-gl=angle','--window-size=1440,900'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:3000/g1/narrativa', { waitUntil: 'networkidle2', timeout: 90000 }).catch(e=>console.log('goto',e.message))
await new Promise(r=>setTimeout(r,2000))
const diag = await page.evaluate(() => {
  const sticky = document.querySelector('.sticky') || [...document.querySelectorAll('div')].find(d=>getComputedStyle(d).position==='sticky')
  const out = { found: !!sticky, chain: [] }
  let el = sticky
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el)
    out.chain.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,40),
      position: cs.position, overflow: cs.overflow, overflowX: cs.overflowX, overflowY: cs.overflowY,
      transform: cs.transform === 'none' ? 'none' : 'HAS', height: cs.height })
    el = el.parentElement
  }
  const b = getComputedStyle(document.body), h = getComputedStyle(document.documentElement)
  out.body = { overflow: b.overflow, overflowX: b.overflowX, overflowY: b.overflowY, transform: b.transform==='none'?'none':'HAS', height: b.height }
  out.html = { overflow: h.overflow, overflowX: h.overflowX, overflowY: h.overflowY }
  return out
})
console.log(JSON.stringify(diag, null, 1))
await browser.close()
