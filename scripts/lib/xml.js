/**
 * Core XML generation functions for sitemaps
 */

/**
 * Escape special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
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
 * @param {Array} urls - Array of URL objects with url, lastModified, changeFrequency, and priority
 * @returns {string} XML string
 */
function convertToXML(urls) {
  if (!Array.isArray(urls) || urls.length === 0) {
    return generateEmptySitemap()
  }
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  urls.forEach(urlObj => {
    xml += '  <url>\n'
    xml += `    <loc>${escapeXml(urlObj.url)}</loc>\n`
    
    if (urlObj.lastModified) {
      const date = urlObj.lastModified instanceof Date 
        ? urlObj.lastModified.toISOString() 
        : urlObj.lastModified
      xml += `    <lastmod>${escapeXml(date.split('T')[0])}</lastmod>\n`
    }
    
    if (urlObj.changeFrequency) {
      xml += `    <changefreq>${escapeXml(urlObj.changeFrequency)}</changefreq>\n`
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
 * @returns {string} Empty sitemap XML
 */
function generateEmptySitemap() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
         '</urlset>'
}

/**
 * Generate root sitemap index XML
 * @param {Array} sitemaps - Array of sitemap objects with loc and lastmod
 * @returns {string} Sitemap index XML
 */
function generateRootIndex(sitemaps) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  sitemaps.forEach(sitemap => {
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

/**
 * Validate sitemap URL object
 * @param {Object} urlObj - URL object to validate
 * @returns {boolean} True if valid
 */
function isValidUrlObject(urlObj) {
  if (!urlObj || typeof urlObj !== 'object') {
    return false
  }
  
  if (!urlObj.url || typeof urlObj.url !== 'string') {
    return false
  }
  
  // Validate URL format
  try {
    new URL(urlObj.url)
  } catch {
    return false
  }
  
  // Validate changeFrequency if present
  const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
  if (urlObj.changeFrequency && !validFrequencies.includes(urlObj.changeFrequency)) {
    return false
  }
  
  // Validate priority if present
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
 * @param {Array} urls - Array of URL objects
 * @returns {Array} Array of valid URL objects
 */
function filterValidUrls(urls) {
  if (!Array.isArray(urls)) {
    return []
  }
  
  return urls.filter(urlObj => {
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
  filterValidUrls
} 