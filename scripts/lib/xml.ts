/**
 * Core XML generation functions for sitemaps
 */

export interface SitemapUrl {
  url: string
  lastModified?: Date | string
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

export interface SitemapIndexEntry {
  loc: string
  lastmod?: string
}

/**
 * Escape special XML characters
 */
export const escapeXml = (str: string | null | undefined): string => {
  if (!str) return ''

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Convert an array of URL objects to sitemap XML
 */
export const convertToXML = (urls: SitemapUrl[]): string => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return generateEmptySitemap()
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  urls.forEach((urlObj) => {
    xml += '  <url>\n'
    xml += `    <loc>${escapeXml(urlObj.url)}</loc>\n`

    if (urlObj.lastModified) {
      const date =
        urlObj.lastModified instanceof Date
          ? urlObj.lastModified.toISOString()
          : urlObj.lastModified
      xml += `    <lastmod>${escapeXml(date.split('T')[0])}</lastmod>\n`
    }

    if (urlObj.changeFrequency) {
      xml += `    <changefreq>${escapeXml(
        urlObj.changeFrequency,
      )}</changefreq>\n`
    }

    if (urlObj.priority !== undefined) {
      xml += `    <priority>${escapeXml(String(urlObj.priority))}</priority>\n`
    }

    xml += '  </url>\n'
  })

  xml += '</urlset>'

  return xml
}

/**
 * Generate empty sitemap XML
 */
export const generateEmptySitemap = (): string => {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '</urlset>'
  )
}

/**
 * Generate root sitemap index XML
 */
export const generateRootIndex = (sitemaps: SitemapIndexEntry[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  sitemaps.forEach((sitemap) => {
    xml += '  <sitemap>\n'
    xml += `    <loc>${escapeXml(sitemap.loc)}</loc>\n`

    if (sitemap.lastmod) {
      xml += `    <lastmod>${escapeXml(sitemap.lastmod)}</lastmod>\n`
    }

    xml += '  </sitemap>\n'
  })

  xml += '</sitemapindex>'

  return xml
}

const VALID_FREQUENCIES: readonly string[] = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]

/**
 * Validate sitemap URL object
 */
export const isValidUrlObject = (
  urlObj: SitemapUrl | null | undefined,
): urlObj is SitemapUrl => {
  if (!urlObj || typeof urlObj !== 'object') {
    return false
  }

  if (!urlObj.url || typeof urlObj.url !== 'string') {
    return false
  }

  try {
    new URL(urlObj.url)
  } catch {
    return false
  }

  if (
    urlObj.changeFrequency &&
    !VALID_FREQUENCIES.includes(urlObj.changeFrequency)
  ) {
    return false
  }

  if (urlObj.priority !== undefined) {
    const priority = Number(urlObj.priority)
    if (isNaN(priority) || priority < 0 || priority > 1) {
      return false
    }
  }

  return true
}

/**
 * Filter and validate URLs before XML generation
 */
export const filterValidUrls = (
  urls: (SitemapUrl | null | undefined)[],
): SitemapUrl[] => {
  if (!Array.isArray(urls)) {
    return []
  }

  return urls.filter((urlObj): urlObj is SitemapUrl => {
    if (!isValidUrlObject(urlObj)) {
      console.warn(`Invalid URL object skipped:`, urlObj)
      return false
    }
    return true
  })
}

module.exports = {
  escapeXml,
  convertToXML,
  generateEmptySitemap,
  generateRootIndex,
  isValidUrlObject,
  filterValidUrls,
}
