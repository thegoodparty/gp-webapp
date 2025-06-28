import { APP_BASE } from 'appEnv'
import { flatStates } from 'helpers/statesHelper'
import candidateSitemap from '../../app/sitemaps/candidates/[state]/sitemap.js'
import stateElectionSitemap from '../../app/sitemaps/state/[state]/sitemap.js'

const appBase = APP_BASE

const currentDate = new Date().toISOString().split('T')[0]

export default async function sitemap(req, res) {
  const sitemaps = ['sitemaps/sitemap.xml']

  // Iterate through each state and include only non-empty sitemaps
  for (let index = 0; index < flatStates.length; index += 1) {
    const state = flatStates[index].toLocaleLowerCase()
    const idObj = { id: index.toString() }

    const stateUrls = await stateElectionSitemap(idObj)
    if (Array.isArray(stateUrls) && stateUrls.length > 0) {
      sitemaps.push(`sitemaps/state/${state}/sitemap/${index}.xml`)
    }

    const candidateUrls = await candidateSitemap(idObj)
    if (Array.isArray(candidateUrls) && candidateUrls.length > 0) {
      sitemaps.push(`sitemaps/candidates/${state}/sitemap/${index}.xml`)
    }
  }

  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  sitemaps.forEach((sitemap) => {
    xmlString += `
      <sitemap>
        <loc>${appBase}/${sitemap}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`
  })

  xmlString += '\n  </sitemapindex>'

  res.writeHead(200, { 'Content-Type': 'application/xml' })
  return res.end(xmlString)
}
