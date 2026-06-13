import https from 'https'

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = new URL(res.headers.location, url).href
          return resolve(fetch(next))
        }
        let d = ''
        res.on('data', (c) => (d += c))
        res.on('end', () => resolve({ url, html: d, status: res.statusCode }))
      })
      .on('error', reject)
  })
}

function extractLinks(html, base) {
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => {
    try {
      return new URL(m[1], base).href
    } catch {
      return m[1]
    }
  })
  return [...new Set(hrefs)].filter((h) => /^https?:\/\//.test(h)).sort()
}

const targets = [
  'https://aigenesis.io/',
  'https://conect.aigenesis.io/',
  'https://conect.aigenesis.io/login',
  'https://conect.aigenesis.io/SingUp',
]

for (const url of targets) {
  try {
    const { html, status } = await fetch(url)
    const links = extractLinks(html, url)
    const product = links.filter((l) =>
      /mining|booster|staking|gpulse|pulse|oracle|geavy|market|shop|token|dashboard|panel|singup|signup|register/i.test(l)
    )
    console.log(`\n=== ${url} (${status}) — product links ===`)
    product.forEach((l) => console.log(l))
    if (!product.length) {
      const conect = links.filter((l) => l.includes('conect.aigenesis'))
      console.log('conect links:', conect.slice(0, 20).join('\n'))
    }
  } catch (e) {
    console.log(`\n=== ${url} ERROR ===`, e.message)
  }
}

// grep aigenesis.io for mining/booster button targets in raw html
const { html } = await fetch('https://aigenesis.io/')
const miningBtns = [...html.matchAll(/href=["']([^"']*(?:mining|booster|staking|conect)[^"']*)["']/gi)]
console.log('\n=== PRODUCT BUTTON HREFS ON HOME ===')
;[...new Set(miningBtns.map((m) => m[1]))].forEach((h) => console.log(h))
