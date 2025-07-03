/**
 * Shared utilities for sitemap generation
 */

const fs = require('fs').promises
const path = require('path')

/**
 * Ensure a directory exists, creating it if necessary
 * @param {string} dirPath - The directory path to ensure exists
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

/**
 * Write sitemap XML to file
 * @param {string} filePath - The file path to write to
 * @param {string} xmlContent - The XML content to write
 */
async function writeSitemapXML(filePath, xmlContent) {
  await fs.writeFile(filePath, xmlContent, 'utf8')
}

/**
 * Normalize URL to ensure consistency
 * @param {string} url - The URL to normalize
 * @returns {string} Normalized URL
 */
function normalizeUrl(url) {
  // Remove trailing slashes
  url = url.replace(/\/$/, '')
  
  // Ensure proper protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  
  return url
}

/**
 * Format date for sitemap lastmod field
 * @param {Date|string} date - The date to format
 * @returns {string} ISO date string
 */
function formatSitemapDate(date) {
  if (!date) {
    return new Date().toISOString()
  }
  
  if (typeof date === 'string') {
    return new Date(date).toISOString()
  }
  
  return date.toISOString()
}

/**
 * Chunk an array into smaller arrays
 * @param {Array} array - The array to chunk
 * @param {number} size - The chunk size
 * @returns {Array} Array of chunks
 */
function chunkArray(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Calculate the approximate size of a sitemap XML string
 * @param {string} xml - The XML string
 * @returns {number} Size in bytes
 */
function getSitemapSize(xml) {
  return Buffer.byteLength(xml, 'utf8')
}

/**
 * Check if sitemap exceeds size limits
 * @param {string} xml - The XML string
 * @returns {boolean} True if exceeds limits
 */
function exceedsSizeLimit(xml) {
  const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB
  return getSitemapSize(xml) > MAX_SIZE_BYTES
}

/**
 * Check if URL array needs to be split based on count or potential size
 * @param {Array} urls - Array of URL objects
 * @returns {boolean} True if needs splitting
 */
function needsSplitting(urls) {
  const MAX_URLS = 50000
  
  // Check URL count first (fast check)
  if (urls.length > MAX_URLS) {
    return true
  }
  
  // For arrays close to the limit, check estimated size
  if (urls.length > 40000) {
    // Estimate size without generating full XML (rough calculation)
    // Each URL entry is roughly 150-200 bytes on average
    const estimatedSize = urls.length * 180
    const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB
    return estimatedSize > MAX_SIZE_BYTES
  }
  
  return false
}

/**
 * Split URLs into chunks that respect both URL count and size limits
 * @param {Array} urls - Array of URL objects
 * @param {Function} convertToXML - Function to convert URLs to XML
 * @returns {Array} Array of URL chunks
 */
function splitUrlsForSitemap(urls, convertToXML) {
  const MAX_URLS = 50000
  const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB
  
  // If small enough, return as single chunk
  if (!needsSplitting(urls)) {
    return [urls]
  }
  
  const chunks = []
  let currentChunk = []
  
  for (const url of urls) {
    // Add URL to current chunk
    currentChunk.push(url)
    
    // Check if we need to finalize this chunk
    if (currentChunk.length >= MAX_URLS) {
      chunks.push(currentChunk)
      currentChunk = []
    } else if (currentChunk.length % 1000 === 0) {
      // Every 1000 URLs, check size to avoid massive chunks
      const testXml = convertToXML(currentChunk)
      if (getSitemapSize(testXml) > MAX_SIZE_BYTES * 0.9) { // 90% of limit
        chunks.push(currentChunk)
        currentChunk = []
      }
    }
  }
  
  // Add remaining URLs if any
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }
  
  return chunks
}

/**
 * Generate multiple sitemap files for large URL sets
 * @param {Array} urls - Array of URL objects  
 * @param {string} baseDir - Base directory for sitemap files
 * @param {string} baseName - Base name for sitemap files (without extension)
 * @param {Function} convertToXML - Function to convert URLs to XML
 * @param {string} baseUrl - Base URL for sitemap index entries
 * @returns {Array} Array of sitemap index entries
 */
async function writeSplitSitemaps(urls, baseDir, baseName, convertToXML, baseUrl) {
  await ensureDirectoryExists(baseDir)
  
  const chunks = splitUrlsForSitemap(urls, convertToXML)
  const sitemapEntries = []
  const currentDate = new Date().toISOString().split('T')[0]
  
  if (chunks.length === 1) {
    // Single sitemap
    const xml = convertToXML(chunks[0])
    const filePath = path.join(baseDir, `${baseName}.xml`)
    await writeSitemapXML(filePath, xml)
    
    sitemapEntries.push({
      loc: `${baseUrl}/${baseName}.xml`,
      lastmod: currentDate
    })
  } else {
    // Multiple sitemaps
    for (let i = 0; i < chunks.length; i++) {
      const xml = convertToXML(chunks[i])
      const fileName = `${baseName}-${i + 1}.xml`
      const filePath = path.join(baseDir, fileName)
      await writeSitemapXML(filePath, xml)
      
      sitemapEntries.push({
        loc: `${baseUrl}/${fileName}`,
        lastmod: currentDate
      })
    }
  }
  
  return sitemapEntries
}

module.exports = {
  ensureDirectoryExists,
  writeSitemapXML,
  normalizeUrl,
  formatSitemapDate,
  chunkArray,
  getSitemapSize,
  exceedsSizeLimit,
  needsSplitting,
  splitUrlsForSitemap,
  writeSplitSitemaps
} 