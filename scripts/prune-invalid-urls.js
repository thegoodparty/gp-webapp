#!/usr/bin/env node

/**
 * Prune invalid URLs from existing sitemaps using validation reports
 * This script reads validation reports and removes 404/invalid URLs from static sitemap files
 */

require('dotenv').config()

const fs = require('fs').promises
const path = require('path')
const { generateRootIndex, convertToXML } = require('./lib/xml')
const { ensureDirectoryExists, writeSitemapXML, writeSplitSitemaps } = require('./lib/sitemap-helpers')

// Environment variables
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || 'https://goodparty.org'
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps')

/**
 * Read and parse validation report
 * @param {string} reportPath - Path to the validation report JSON file
 * @returns {Object} Parsed validation report
 */
async function readValidationReport(reportPath) {
  try {
    const reportContent = await fs.readFile(reportPath, 'utf8')
    return JSON.parse(reportContent)
  } catch (error) {
    throw new Error(`Failed to read validation report: ${error.message}`)
  }
}

/**
 * Extract invalid URLs from validation report
 * @param {Object} validationReport - The parsed validation report
 * @returns {Set} Set of invalid URLs for fast lookup
 */
function extractInvalidUrls(validationReport) {
  const invalidUrls = new Set()
  
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
 * @param {string} xmlContent - The XML content
 * @returns {Array} Array of URL objects
 */
function parseXMLSitemap(xmlContent) {
  const urls = []
  
  // Simple regex-based XML parsing (works for our consistent format)
  const urlMatches = xmlContent.match(/<url>[\s\S]*?<\/url>/g) || []
  
  urlMatches.forEach(urlBlock => {
    const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/)
    const lastModMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/)
    const changeFreqMatch = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/)
    const priorityMatch = urlBlock.match(/<priority>(.*?)<\/priority>/)
    
    if (locMatch) {
      const urlObj = {
        url: locMatch[1],
        lastModified: lastModMatch ? new Date(lastModMatch[1]) : new Date(),
        changeFrequency: changeFreqMatch ? changeFreqMatch[1] : 'monthly',
        priority: priorityMatch ? parseFloat(priorityMatch[1]) : 0.5,
      }
      urls.push(urlObj)
    }
  })
  
  return urls
}

/**
 * Process a single sitemap file
 * @param {string} filePath - Path to the sitemap XML file
 * @param {Set} invalidUrls - Set of invalid URLs to remove
 * @returns {Object} Result object with stats
 */
async function processSitemapFile(filePath, invalidUrls) {
  try {
    const xmlContent = await fs.readFile(filePath, 'utf8')
    const urls = parseXMLSitemap(xmlContent)
    
    const originalCount = urls.length
    const validUrls = urls.filter(urlObj => !invalidUrls.has(urlObj.url))
    const removedCount = originalCount - validUrls.length
    
    if (removedCount > 0) {
      // Regenerate XML with valid URLs only
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
    console.error(`Error processing ${filePath}:`, error.message)
    return {
      filePath,
      originalCount: 0,
      validCount: 0,
      removedCount: 0,
      processed: false,
      error: error.message
    }
  }
}

/**
 * Find all sitemap XML files recursively
 * @param {string} dir - Directory to search
 * @returns {Array} Array of sitemap file paths
 */
async function findSitemapFiles(dir) {
  const files = []
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await findSitemapFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile() && entry.name.endsWith('.xml') && entry.name !== 'sitemap-index.xml') {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message)
  }
  
  return files
}

/**
 * Regenerate sitemap index after pruning
 * @param {string} outputDir - Output directory
 * @returns {Object} Index generation stats
 */
async function regenerateSitemapIndex(outputDir) {
  try {
    const sitemapFiles = await findSitemapFiles(outputDir)
    const sitemapIndex = []
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Generate sitemap index entries
    sitemapFiles.forEach(filePath => {
      // Convert file path to URL
      const relativePath = path.relative(outputDir, filePath)
      const url = `${APP_BASE}/sitemaps/${relativePath.replace(/\\/g, '/')}`
      
      sitemapIndex.push({
        loc: url,
        lastmod: currentDate
      })
    })
    
    // Generate and write sitemap index
    const indexXml = generateRootIndex(sitemapIndex)
    await writeSitemapXML(path.join(outputDir, 'sitemap-index.xml'), indexXml)
    
    return {
      totalSitemaps: sitemapIndex.length,
      indexGenerated: true
    }
  } catch (error) {
    console.error('Error regenerating sitemap index:', error.message)
    return {
      totalSitemaps: 0,
      indexGenerated: false,
      error: error.message
    }
  }
}

/**
 * Main function to prune invalid URLs from sitemaps
 */
async function pruneInvalidUrls(options = {}) {
  const { validationReportPath, dryRun = false } = options
  const startTime = Date.now()
  
  console.log('🚀 Starting URL pruning process...')
  console.log(`📁 Sitemap directory: ${OUTPUT_DIR}`)
  console.log(`📊 Validation report: ${validationReportPath}`)
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified')
  }
  
  try {
    // Read validation report
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
    
    // Find all sitemap files
    console.log('\n🔍 Finding sitemap files...')
    const sitemapFiles = await findSitemapFiles(OUTPUT_DIR)
    console.log(`   Found ${sitemapFiles.length} sitemap files to process`)
    
    // Process each sitemap file
    console.log('\n🧹 Processing sitemap files...')
    const results = []
    let totalOriginal = 0
    let totalValid = 0
    let totalRemoved = 0
    let filesModified = 0
    
    for (const filePath of sitemapFiles) {
      const relativePath = path.relative(OUTPUT_DIR, filePath)
      process.stdout.write(`  Processing ${relativePath}... `)
      
      if (dryRun) {
        // In dry run, just analyze without modifying
        try {
          const xmlContent = await fs.readFile(filePath, 'utf8')
          const urls = parseXMLSitemap(xmlContent)
          const originalCount = urls.length
          const validUrls = urls.filter(urlObj => !invalidUrls.has(urlObj.url))
          const removedCount = originalCount - validUrls.length
          
          const result = {
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
          console.log(`❌ Error: ${error.message}`)
        }
      } else {
        // Actually process and modify files
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
    
    // Regenerate sitemap index if files were modified
    if (!dryRun && filesModified > 0) {
      console.log('\n📝 Regenerating sitemap index...')
      const indexResult = await regenerateSitemapIndex(OUTPUT_DIR)
      
      if (indexResult.indexGenerated) {
        console.log(`✅ Sitemap index updated with ${indexResult.totalSitemaps} sitemaps`)
      } else {
        console.log(`❌ Failed to regenerate sitemap index: ${indexResult.error}`)
      }
    }
    
    // Generate summary report
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
      // Save pruning report
      const pruningReport = {
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
      await fs.writeFile(reportPath, JSON.stringify(pruningReport, null, 2))
      console.log(`📊 Pruning report saved to: ${path.relative(process.cwd(), reportPath)}`)
    }
    
  } catch (error) {
    console.error('❌ Error during URL pruning:', error.message)
    process.exit(1)
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  
  let validationReportPath = null
  
  // Find validation report path
  const reportArgIndex = args.findIndex(arg => arg === '--report')
  if (reportArgIndex !== -1 && args[reportArgIndex + 1]) {
    validationReportPath = args[reportArgIndex + 1]
  } else {
    // Look for most recent validation report
    const fs = require('fs')
    try {
      const files = fs.readdirSync(OUTPUT_DIR)
      const validationFiles = files
        .filter(f => f.startsWith('validation-report-') && f.endsWith('.json'))
        .sort()
        .reverse()
      
      if (validationFiles.length > 0) {
        validationReportPath = path.join(OUTPUT_DIR, validationFiles[0])
        console.log(`📊 Using most recent validation report: ${validationFiles[0]}`)
      }
    } catch (error) {
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
      console.error('❌ Fatal error:', error.message)
      process.exit(1)
    })
}

module.exports = { pruneInvalidUrls, extractInvalidUrls, parseXMLSitemap } 