/**
 * Shared utilities for sitemap generation
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { SitemapUrl, SitemapIndexEntry } from './xml'

/**
 * Ensure a directory exists, creating it if necessary
 */
export const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

/**
 * Write sitemap XML to file
 */
export const writeSitemapXML = async (
  filePath: string,
  xmlContent: string,
): Promise<void> => {
  await fs.writeFile(filePath, xmlContent, 'utf8')
}

/**
 * Normalize URL to ensure consistency
 */
export const normalizeUrl = (url: string): string => {
  let normalized = url.replace(/\/$/, '')

  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized
  }

  return normalized
}

/**
 * Format date for sitemap lastmod field
 */
export const formatSitemapDate = (date?: Date | string): string => {
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
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Calculate the approximate size of a sitemap XML string
 */
export const getSitemapSize = (xml: string): number => {
  return Buffer.byteLength(xml, 'utf8')
}

const MAX_SIZE_BYTES = 50 * 1024 * 1024

/**
 * Check if sitemap exceeds size limits
 */
export const exceedsSizeLimit = (xml: string): boolean => {
  return getSitemapSize(xml) > MAX_SIZE_BYTES
}

const MAX_URLS = 50000

/**
 * Check if URL array needs to be split based on count or potential size
 */
export const needsSplitting = (urls: SitemapUrl[]): boolean => {
  if (urls.length > MAX_URLS) {
    return true
  }

  if (urls.length > 40000) {
    const estimatedSize = urls.length * 180
    return estimatedSize > MAX_SIZE_BYTES
  }

  return false
}

/**
 * Split URLs into chunks that respect both URL count and size limits
 */
export const splitUrlsForSitemap = (
  urls: SitemapUrl[],
  xmlConverter: (urls: SitemapUrl[]) => string,
): SitemapUrl[][] => {
  if (!needsSplitting(urls)) {
    return [urls]
  }

  const chunks: SitemapUrl[][] = []
  let currentChunk: SitemapUrl[] = []

  for (const url of urls) {
    currentChunk.push(url)

    if (currentChunk.length >= MAX_URLS) {
      chunks.push(currentChunk)
      currentChunk = []
    } else if (currentChunk.length % 1000 === 0) {
      const testXml = xmlConverter(currentChunk)
      if (getSitemapSize(testXml) > MAX_SIZE_BYTES * 0.9) {
        chunks.push(currentChunk)
        currentChunk = []
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

/**
 * Generate multiple sitemap files for large URL sets
 */
export const writeSplitSitemaps = async (
  urls: SitemapUrl[],
  baseDir: string,
  baseName: string,
  xmlConverter: (urls: SitemapUrl[]) => string,
  baseUrl: string,
): Promise<SitemapIndexEntry[]> => {
  await ensureDirectoryExists(baseDir)

  const chunks = splitUrlsForSitemap(urls, xmlConverter)
  const sitemapEntries: SitemapIndexEntry[] = []
  const currentDate = new Date().toISOString().split('T')[0]

  if (chunks.length === 1) {
    const firstChunk = chunks[0]
    if (firstChunk) {
      const xml = xmlConverter(firstChunk)
      const filePath = path.join(baseDir, `${baseName}.xml`)
      await writeSitemapXML(filePath, xml)

      sitemapEntries.push({
        loc: `${baseUrl}/${baseName}.xml`,
        lastmod: currentDate,
      })
    }
  } else {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      if (!chunk) continue
      const xml = xmlConverter(chunk)
      const fileName = `${baseName}-${i + 1}.xml`
      const filePath = path.join(baseDir, fileName)
      await writeSitemapXML(filePath, xml)

      sitemapEntries.push({
        loc: `${baseUrl}/${fileName}`,
        lastmod: currentDate,
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
  writeSplitSitemaps,
}
