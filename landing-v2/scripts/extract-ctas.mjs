/**
 * Herramienta de desarrollo: rastrea el sitio legacy para sacar los enlaces
 * oficiales. NO forma parte del build ni viaja al navegador.
 *
 * OJO con el patrón de `aigtoken.io`: ese dominio va a redirigir a
 * aigenesis.io/#token, así que dejará de devolver PDFs y ese bloque saldrá
 * siempre en cero. Un cero de aquí NO significa que falte un enlace — significa
 * que el dominio ya no sirve nada. El whitepaper ya no se busca ahí: vive en
 * `public/docs/`.
 */
import https from 'https'
import fs from 'fs'

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let d = ''
        res.on('data', (c) => (d += c))
        res.on('end', () => resolve(d))
      })
      .on('error', reject)
  })
}

const html = await fetch('https://aigenesis.io/')

// All conect + bscscan + pdf links with surrounding context
const patterns = [
  /href="(https:\/\/conect\.aigenesis\.io[^"]*)"/g,
  /href="(https:\/\/bscscan\.com[^"]*)"/g,
  /href="(https:\/\/aigtoken\.io[^"]*\.pdf)"/g,
  /href="(https:\/\/aigenesis\.io\/wp-content\/uploads\/[^"]*\.pdf)"/g,
]

for (const re of patterns) {
  const matches = [...html.matchAll(re)]
  console.log(`\n=== ${re.source} (${matches.length}) ===`)
  ;[...new Set(matches.map((m) => m[1]))].forEach((u) => console.log(u))
}

// anchor texts near conect links
const linkBlocks = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
const interesting = linkBlocks.filter((m) =>
  /conect|SingUp|login|mining|booster|staking|DESCARGAR|Quiero|MARKETING|bscscan|white/i.test(
    m[0]
  )
)
console.log('\n=== INTERESTING <a> TAGS ===')
interesting.slice(0, 30).forEach((m) => {
  const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
  console.log(JSON.stringify({ href: m[1], text }))
})
