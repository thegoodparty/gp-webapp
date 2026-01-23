#!/usr/bin/env node

/**
 * Prune invalid URLs from existing sitemaps using validation reports
 * This script reads validation reports and removes 404/invalid URLs from static sitemap files
 */

import * as fsPromises from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'
import { generateRootIndex, convertToXML, SitemapUrl, SitemapIndexEntry } from './lib/xml'
import { writeSitemapXML } from './lib/sitemap-helpers'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
const VALID_FREQUENCIES: readonly string[] = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']

function isValidChangeFrequency(value: string): value is ChangeFrequency {
  return VALID_FREQUENCIES.includes(value)
}

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || 'https://goodparty.org'
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps')

interface InvalidUrlEntry {
  url: string
  status?: number | null
  message?: string
}

interface ValidationReport {
  summary?: {
    total?: number
  }
  invalidUrls?: InvalidUrlEntry[]
}

interface ProcessResult {
  filePath: string
  originalCount: number
  validCount: number
  removedCount: number
  processed: boolean
  error?: string
}

interface PruneOptions {
  validationReportPath: string
  dryRun?: boolean
}

interface IndexResult {
  totalSitemaps: number
  indexGenerated: boolean
  error?: string
}

interface PruningReport {
  timestamp: string
  validationReportUsed: string
  summary: {
    filesProcessed: number
    filesModified: number
    totalOriginalUrls: number
    totalValidUrls: number
    totalRemovedUrls: number
  }
  fileResults: Array<{
    file: string
    originalCount: number
    validCount: number
    removedCount: number
    processed: boolean
  }>
}

/**
 * Read and parse validation report
 */
const readValidationReport = async (reportPath: string): Promise<ValidationReport> => {
  try {
    const reportContent = await fsPromises.readFile(reportPath, 'utf8')
    return JSON.parse(reportContent)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to read validation report: ${errorMessage}`)
  }
}

/**
 * Extract invalid URLs from validation report
 */
const extractInvalidUrls = (validationReport: ValidationReport): Set<string> => {
  const invalidUrls = new Set<string>()
  
  if (validationReport.invalidUrls && Array.isArray(validationReport.invalidUrls)) {
    validationReport.invalidUrls.forEach(item => {
      if (item.url) {
        invalidUrls.add(item.url)
      }
    })
  }
  
  return invalidUrls
}

/**
 * Parse XML sitemap to extract URLs
 */
const parseXMLSitemap = (xmlContent: string): SitemapUrl[] => {
  const urls: SitemapUrl[] = []
  
  const urlMatches = xmlContent.match(/<url>[\s\S]*?<\/url>/g) || []
  
  urlMatches.forEach(urlBlock => {
    const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/)
    const lastModMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/)
    const changeFreqMatch = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/)
    const priorityMatch = urlBlock.match(/<priority>(.*?)<\/priority>/)
    
    const locValue = locMatch?.[1]
    if (locMatch && locValue) {
      const changeFreq = changeFreqMatch?.[1] || 'monthly'
      const validChangeFreq = isValidChangeFrequency(changeFreq) ? changeFreq : 'monthly'
      const lastModValue = lastModMatch?.[1]
      const priorityValue = priorityMatch?.[1]
      
      const urlObj: SitemapUrl = {
        url: locValue,
        lastModified: lastModValue ? new Date(lastModValue) : new Date(),
        changeFrequency: validChangeFreq,
        priority: priorityValue ? parseFloat(priorityValue) : 0.5,
      }
      urls.push(urlObj)
    }
  })
  
  return urls
}

/**
 * Process a single sitemap file
 */
const processSitemapFile = async (
  filePath: string,
  invalidUrls: Set<string>
): Promise<ProcessResult> => {
  try {
    const xmlContent = await fsPromises.readFile(filePath, 'utf8')
    const urls = parseXMLSitemap(xmlContent)
    
    const originalCount = urls.length
    const validUrls = urls.filter(urlObj => !invalidUrls.has(urlObj.url))
    const removedCount = originalCount - validUrls.length
    
    if (removedCount > 0) {
      const newXmlContent = convertToXML(validUrls)
      await writeSitemapXML(filePath, newXmlContent)
    }
    
    return {
      filePath,
      originalCount,
      validCount: validUrls.length,
      removedCount,
      processed: removedCount > 0
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error processing ${filePath}:`, errorMessage)
    return {
      filePath,
      originalCount: 0,
      validCount: 0,
      removedCount: 0,
      processed: false,
      error: errorMessage
    }
  }
}

/**
 * Find all sitemap XML files recursively
 */
const findSitemapFiles = async (dir: string): Promise<string[]> => {
  const files: string[] = []
  
  try {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        const subFiles = await findSitemapFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile() && entry.name.endsWith('.xml') && entry.name !== 'sitemap-index.xml') {
        files.push(fullPath)
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error reading directory ${dir}:`, errorMessage)
  }
  
  return files
}

/**
 * Regenerate root sitemap index after pruning
 */
const regenerateSitemapIndex = async (outputDir: string): Promise<IndexResult> => {
  try {
    const sitemapFiles = await findSitemapFiles(outputDir)
    const sitemapIndex: SitemapIndexEntry[] = []
    const currentDate = new Date().toISOString().split('T')[0]
    
    sitemapFiles.forEach(filePath => {
      const relativePath = path.relative(outputDir, filePath)
      const url = `${APP_BASE}/sitemaps/${relativePath.replace(/\\/g, '/')}`
      
      sitemapIndex.push({
        loc: url,
        lastmod: currentDate
      })
    })
    
    const indexXml = generateRootIndex(sitemapIndex)
    await writeSitemapXML(path.join(process.cwd(), 'public', 'sitemap.xml'), indexXml)
    
    return {
      totalSitemaps: sitemapIndex.length,
      indexGenerated: true
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error regenerating sitemap index:', errorMessage)
    return {
      totalSitemaps: 0,
      indexGenerated: false,
      error: errorMessage
    }
  }
}

/**
 * Main function to prune invalid URLs from sitemaps
 */
const pruneInvalidUrls = async (options: PruneOptions): Promise<void> => {
  const { validationReportPath, dryRun = false } = options
  const startTime = Date.now()
  
  console.log('🚀 Starting URL pruning process...')
  console.log(`📁 Sitemap directory: ${OUTPUT_DIR}`)
  console.log(`📊 Validation report: ${validationReportPath}`)
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified')
  }
  
  try {
    console.log('\n📊 Reading validation report...')
    const validationReport = await readValidationReport(validationReportPath)
    const invalidUrls = extractInvalidUrls(validationReport)
    
    console.log(`   Total URLs validated: ${validationReport.summary?.total || 0}`)
    console.log(`   Invalid URLs found: ${invalidUrls.size}`)
    console.log(`   Valid URLs: ${(validationReport.summary?.total || 0) - invalidUrls.size}`)
    
    if (invalidUrls.size === 0) {
      console.log('✅ No invalid URLs found - nothing to prune!')
      return
    }
    
    console.log('\n🔍 Finding sitemap files...')
    const sitemapFiles = await findSitemapFiles(OUTPUT_DIR)
    console.log(`   Found ${sitemapFiles.length} sitemap files to process`)
    
    console.log('\n🧹 Processing sitemap files...')
    const results: ProcessResult[] = []
    let totalOriginal = 0
    let totalValid = 0
    let totalRemoved = 0
    let filesModified = 0
    
    for (const filePath of sitemapFiles) {
      const relativePath = path.relative(OUTPUT_DIR, filePath)
      process.stdout.write(`  Processing ${relativePath}... `)
      
      if (dryRun) {
        try {
          const xmlContent = await fsPromises.readFile(filePath, 'utf8')
          const urls = parseXMLSitemap(xmlContent)
          const originalCount = urls.length
          const validUrls = urls.filter(urlObj => !invalidUrls.has(urlObj.url))
          const removedCount = originalCount - validUrls.length
          
          const result: ProcessResult = {
            filePath: relativePath,
            originalCount,
            validCount: validUrls.length,
            removedCount,
            processed: false
          }
          results.push(result)
          
          totalOriginal += originalCount
          totalValid += validUrls.length
          totalRemoved += removedCount
          
          if (removedCount > 0) {
            filesModified++
            console.log(`📋 ${originalCount} → ${validUrls.length} (-${removedCount})`)
          } else {
            console.log(`✅ ${originalCount} (no changes)`)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.log(`❌ Error: ${errorMessage}`)
        }
      } else {
        const result = await processSitemapFile(filePath, invalidUrls)
        results.push(result)
        
        totalOriginal += result.originalCount
        totalValid += result.validCount
        totalRemoved += result.removedCount
        
        if (result.error) {
          console.log(`❌ Error: ${result.error}`)
        } else if (result.processed) {
          filesModified++
          console.log(`✅ ${result.originalCount} → ${result.validCount} (-${result.removedCount})`)
        } else {
          console.log(`✅ ${result.originalCount} (no changes)`)
        }
      }
    }
    
    if (!dryRun && filesModified > 0) {
      console.log('\n📝 Regenerating sitemap index...')
      const indexResult = await regenerateSitemapIndex(OUTPUT_DIR)
      
      if (indexResult.indexGenerated) {
        console.log(`✅ Root sitemap index (public/sitemap.xml) updated with ${indexResult.totalSitemaps} sitemaps`)
      } else {
        console.log(`❌ Failed to regenerate root sitemap index: ${indexResult.error}`)
      }
    }
    
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    
    console.log('\n🎉 URL pruning completed!')
    console.log(`⏱️  Processing time: ${duration}s`)
    console.log(`📊 Summary:`)
    console.log(`   Files processed: ${sitemapFiles.length}`)
    console.log(`   Files modified: ${filesModified}`)
    console.log(`   Total URLs before: ${totalOriginal}`)
    console.log(`   Total URLs after: ${totalValid}`)
    console.log(`   URLs removed: ${totalRemoved}`)
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.')
    } else {
      const pruningReport: PruningReport = {
        timestamp: new Date().toISOString(),
        validationReportUsed: validationReportPath,
        summary: {
          filesProcessed: sitemapFiles.length,
          filesModified,
          totalOriginalUrls: totalOriginal,
          totalValidUrls: totalValid,
          totalRemovedUrls: totalRemoved
        },
        fileResults: results.map(r => ({
          file: path.relative(OUTPUT_DIR, r.filePath),
          originalCount: r.originalCount,
          validCount: r.validCount,
          removedCount: r.removedCount,
          processed: r.processed
        }))
      }
      
      const reportPath = path.join(OUTPUT_DIR, `pruning-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
      await fsPromises.writeFile(reportPath, JSON.stringify(pruningReport, null, 2))
      console.log(`📊 Pruning report saved to: ${path.relative(process.cwd(), reportPath)}`)
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error during URL pruning:', errorMessage)
    process.exit(1)
  }
}

if (require.main === module) {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  
  let validationReportPath: string | null = null
  
  const reportArgIndex = args.findIndex(arg => arg === '--report')
  const reportPathArg = reportArgIndex !== -1 ? args[reportArgIndex + 1] : undefined
  if (reportPathArg) {
    validationReportPath = reportPathArg
  } else {
    try {
      const files = fs.readdirSync(OUTPUT_DIR)
      const validationFiles = files
        .filter(f => f.startsWith('validation-report-') && f.endsWith('.json'))
        .sort()
        .reverse()
      
      const latestFile = validationFiles[0]
      if (latestFile) {
        validationReportPath = path.join(OUTPUT_DIR, latestFile)
        console.log(`📊 Using most recent validation report: ${latestFile}`)
      }
    } catch {
      // Directory doesn't exist or no files
    }
  }
  
  if (!validationReportPath) {
    console.error('❌ No validation report found!')
    console.error('Usage: node scripts/prune-invalid-urls.js [--report <path>] [--dry-run]')
    console.error('   or: npm run prune-invalid-urls [-- --report <path>] [--dry-run]')
    process.exit(1)
  }
  
  pruneInvalidUrls({ validationReportPath, dryRun })
    .catch(error => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Fatal error:', errorMessage)
      process.exit(1)
    })
}

export { pruneInvalidUrls, extractInvalidUrls, parseXMLSitemap }

module.exports = { pruneInvalidUrls, extractInvalidUrls, parseXMLSitemap }
