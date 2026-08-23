import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const urls = ['https://aitechone.io/', 'https://aitechone.io/eventos', 'https://aitechone.io/ecosistema', 'https://aitechone.io/sobre-aitech-one', 'https://aitechone.io/como-funciona']
for (const u of urls) {
  await page.goto(u, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => console.log('goto', e.message))
  await new Promise((r) => setTimeout(r, 2500))
  const media = await page.evaluate(() => {
    const out = { videos: [], bgVideos: [], imgs: [] }
    document.querySelectorAll('video').forEach((v) => {
      const src = v.currentSrc || v.src || (v.querySelector('source') && v.querySelector('source').src) || ''
      out.videos.push({ src, poster: v.poster || '' })
    })
    // background videos / images en CSS
    document.querySelectorAll('*').forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage
      if (bg && bg.includes('url(') && (bg.includes('.mp4') || bg.includes('.webm'))) out.bgVideos.push(bg.slice(0, 160))
    })
    const perf = performance.getEntriesByType('resource').map((r) => r.name)
    out.mediaFiles = perf.filter((n) => /\.(mp4|webm|mov)(\?|$)/i.test(n))
    out.imgFiles = perf.filter((n) => /\.(webp|jpg|jpeg|png)(\?|$)/i.test(n)).slice(0, 8)
    return out
  })
  console.log('\n=== ' + u + ' ===')
  console.log('videos:', JSON.stringify(media.videos))
  console.log('mediaFiles:', JSON.stringify(media.mediaFiles))
  console.log('bgVideos:', JSON.stringify(media.bgVideos))
}
await browser.close()
