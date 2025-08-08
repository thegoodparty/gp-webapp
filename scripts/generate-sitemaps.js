#!/usr/bin/env node

/**
 * Generate static sitemap XML files at build time
 * This script generates all sitemaps and writes them to public/sitemaps/
 */

const fs = require('fs').promises
const path = require('path')
const { generateRootIndex, convertToXML } = require('./lib/xml')
const { ensureDirectoryExists, writeSitemapXML, writeSplitSitemaps } = require('./lib/sitemap-helpers')
const { validateUrls, generateValidationReport, filterValidUrls } = require('./validate-sitemap-urls')

// Environment variables
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || 'https://goodparty.org'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://gp-api.goodparty.org'
const ELECTION_API_BASE = process.env.NEXT_PUBLIC_ELECTION_API_BASE || 'https://election-api.goodparty.org'

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps')

// States array
const flatStates = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
  'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN',
  'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA',
  'WI', 'WV', 'WY'
]

// Alphabet for political terms
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

/**
 * Simple fetch implementation for Node.js with proper error handling
 */
async function fetchData(url) {
  const fetch = (await import('node-fetch')).default
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`)
  }
  
  return await response.json()
}

/**
 * Fetch data from GP API
 */
async function fetchGPData(path, params = {}) {
  const queryString = Object.keys(params).length
    ? `?${new URLSearchParams(params)}`
    : ''
  const url = `${API_BASE}${path}${queryString}`
  return await fetchData(url)
}

/**
 * Fetch data from Election API
 */
async function fetchElectionData(path, params = {}) {
  const queryString = Object.keys(params).length
    ? `?${new URLSearchParams(params)}`
    : ''
  const url = `${ELECTION_API_BASE}/v1${path}${queryString}`
  return await fetchData(url)
}

/**
 * Fetch blog articles
 */
async function fetchBlogArticles() {
  try {
    const articles = await fetchGPData('/v1/content/type/blogArticle')
    return Array.isArray(articles) ? articles : []
  } catch (error) {
    console.error('Error fetching blog articles:', error.message)
    return []
  }
}

/**
 * Extract blog sections from blog articles
 */
function extractBlogSections(blogArticles) {
  const sectionsMap = new Map()
  
  blogArticles.forEach(article => {
    if (article.section?.fields?.slug) {
      const section = article.section.fields
      sectionsMap.set(section.slug, section)
    }
  })
  
  return Array.from(sectionsMap.values())
}

/**
 * Fetch blog sections
 */
async function fetchBlogSections() {
  try {
    const sections = await fetchGPData('/v1/content/blog-articles/by-section')
    return Array.isArray(sections) ? sections : []
  } catch (error) {
    console.error('Error fetching blog sections:', error.message)
    return []
  }
}

/**
 * Fetch FAQ articles
 */
async function fetchFAQArticles() {
  try {
    const faqs = await fetchGPData('/v1/content/type/faqArticle')
    return Array.isArray(faqs) ? faqs : []
  } catch (error) {
    console.error('Error fetching FAQ articles:', error.message)
    return []
  }
}

/**
 * Fetch glossary terms
 */
async function fetchGlossaryTerms() {
  try {
    const glossary = await fetchGPData('/v1/content/type/glossaryItem/by-slug')
    
    // Validate that the response is a proper object (not an error response)
    if (!glossary || typeof glossary !== 'object' || Array.isArray(glossary)) {
      console.warn('Invalid glossary response format, using empty object')
      return {}
    }
    
    // Check if this looks like an error response (has error-like properties)
    if (glossary.hasOwnProperty('error') || glossary.hasOwnProperty('statusCode') || glossary.hasOwnProperty('message')) {
      console.warn('Glossary response appears to be an error object, using empty object')
      return {}
    }
    
    return glossary
  } catch (error) {
    console.error('Error fetching glossary terms:', error.message)
    return {}
  }
}

/**
 * Generate FAQ article route (matches faqArticleRoute helper exactly)
 */
function getFaqArticleRoute(article) {
  try {
    // Import slugify to match frontend exactly
    const slugify = require('slugify')
    const title = article.fields?.title || article.title || ''
    if (!title) {
      return `/faqs/unknown-${Date.now()}`
    }
    const slug = slugify(title, { lower: true })
    return `/faqs/${slug}`
  } catch (error) {
    console.error('Error generating FAQ route:', error)
    return `/faqs/unknown-${Date.now()}`
  }
}

/**
 * Generate main sitemap
 */
async function generateMainSitemap() {
  const now = new Date()
  const mainSitemap = []
  
  // Static URLs
  const staticUrls = [
    '/',
    '/about',
    '/run-for-office',
    '/team',
    '/candidates',
    '/login',
    '/faqs',
    '/privacy',
    '/work-with-us',
    '/contact',
    '/political-terms',
    '/volunteer',
    '/academy',
    '/academy-intro',
    '/info-session',
    '/academy-webinar',
    '/blog',
    '/ads2023',
    '/elections',
  ]

  staticUrls.forEach((url) => {
    mainSitemap.push({
      url: `${APP_BASE}${url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    })
  })

  // Add alphabet pages for political terms
  ALPHABET.forEach((letter) => {
    mainSitemap.push({
      url: `${APP_BASE}/political-terms/${letter}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  // Fetch and add dynamic content
  console.log('   📚 Fetching blog articles...')
  const [blogArticles, faqArticles, glossaryTerms] = await Promise.all([
    fetchBlogArticles(),
    fetchFAQArticles(),
    fetchGlossaryTerms()
  ])

  // Extract blog sections from articles
  const blogSections = extractBlogSections(blogArticles)

  // Add blog articles
  if (blogArticles.length > 0) {
    console.log(`   📝 Adding ${blogArticles.length} blog articles`)
    
    let addedCount = 0
    blogArticles.forEach((article) => {
      if (article.slug) {
        mainSitemap.push({
          url: `${APP_BASE}/blog/article/${article.slug}`,
          lastModified: article.publishDate ? new Date(article.publishDate) : now,
          changeFrequency: 'monthly',
          priority: 0.9,
        })
        addedCount++
      }
    })
    console.log(`   ✅ Actually added ${addedCount} blog articles to sitemap`)
  }

  // Add blog sections
  if (blogSections.length > 0) {
    console.log(`   📂 Adding ${blogSections.length} blog sections`)
    blogSections.forEach((section) => {
      // Check both possible slug locations for flexibility
      const slug = section.slug || section.fields?.slug
      if (slug) {
        mainSitemap.push({
          url: `${APP_BASE}/blog/section/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.9,
        })
      }
    })
  }

  // Add FAQ articles
  if (faqArticles.length > 0) {
    console.log(`   ❓ Adding ${faqArticles.length} FAQ articles`)
    faqArticles.forEach((article) => {
      const route = getFaqArticleRoute(article)
      mainSitemap.push({
        url: `${APP_BASE}${route}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  }

  // Add glossary terms
  const glossaryKeys = Object.keys(glossaryTerms)
  if (glossaryKeys.length > 0) {
    console.log(`   📚 Adding ${glossaryKeys.length} glossary terms`)
    glossaryKeys.forEach((slug) => {
      mainSitemap.push({
        url: `${APP_BASE}/political-terms/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } else {
    console.log(`   📚 No glossary terms found`)
  }
  
  return mainSitemap
}

/**
 * Generate state election sitemap
 */
async function generateStateSitemap(state, index) {
  const now = new Date()
  
  try {
    // Fetch places and races for this state
    const [places, races] = await Promise.all([
      fetchElectionData('/places', { state, placeColumns: 'slug' }),
      fetchElectionData('/races', { state, raceColumns: 'slug' })
    ])
    
    const urls = []
    
    // Add place URLs
    if (Array.isArray(places)) {
      places.forEach((place) => {
        if (place.slug) {
          urls.push({
            url: `${APP_BASE}/elections/${place.slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      })
    }
    
    // Add race URLs
    if (Array.isArray(races)) {
      races.forEach((race) => {
        if (race.slug) {
          urls.push({
            url: `${APP_BASE}/elections/position/${race.slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      })
    }
    
    return urls
  } catch (error) {
    console.error(`Error generating state sitemap for ${state}:`, error.message)
    return []
  }
}

/**
 * Generate candidate sitemap
 */
async function generateCandidateSitemap(state, index) {
  const now = new Date()
  
  try {
    // Fetch candidates for this state
    const candidates = await fetchElectionData('/candidacies', { 
      state, 
      columns: 'slug' 
    })
    
    const urls = []
    
    // Add candidate URLs
    if (Array.isArray(candidates)) {
      candidates.forEach((candidate) => {
        if (candidate.slug) {
          urls.push({
            url: `${APP_BASE}/candidate/${candidate.slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
          })
        }
      })
    }
    
    return urls
  } catch (error) {
    console.error(`Error generating candidate sitemap for ${state}:`, error.message)
    return []
  }
}

/**
 * Main function to generate all sitemaps
 */
async function generateSitemaps(options = {}) {
  const { validate = false, validationOptions = {}, mainOnly = false } = options
  const startTime = Date.now()
  console.log('🚀 Starting sitemap generation...')
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
  console.log(`🌐 App base URL: ${APP_BASE}`)
  
  if (validate) {
    console.log('🔍 URL validation: ENABLED')
  }
  
  try {
    // Ensure output directory exists
    await ensureDirectoryExists(OUTPUT_DIR)
    
    // Track all generated sitemaps for the index
    const sitemapIndex = []
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Track all URLs for validation
    const allUrls = []
    let validationReport = null
    let mainValidationResults = null
    
    // Generate main sitemap
    console.log('\n📝 Generating main sitemap...')
    let mainUrls = await generateMainSitemap()
    
    // Validate main sitemap URLs if validation is enabled
    if (validate) {
      console.log('\n🔍 Validating main sitemap URLs...')
      mainValidationResults = await validateUrls(mainUrls, validationOptions)
      validationReport = generateValidationReport(mainValidationResults)
      
      const invalidCount = mainValidationResults.summary.invalid
      if (invalidCount > 0) {
        console.log(`   ⚠️  Found ${invalidCount} invalid URLs in main sitemap`)
        console.log(`   Note: Invalid URLs were kept in sitemaps for debugging. Use validation report to fix them.`)
      } else {
        console.log(`   ✅ All ${mainValidationResults.summary.valid} main sitemap URLs are valid`)
      }
    }
    
    allUrls.push(...mainUrls)
    
    // Filter main URLs based on validation results if validation was performed
    let filteredMainUrls = mainUrls
    if (validate && mainValidationResults) {
      // Use the validation results to filter URLs (removes redirects, etc.)
      filteredMainUrls = filterValidUrls(mainUrls, mainValidationResults)
      const removedCount = mainUrls.length - filteredMainUrls.length
      if (removedCount > 0) {
        console.log(`   🗑️  Removed ${removedCount} URLs from sitemap based on validation results`)
      }
    }

    // Write main sitemap with size limit handling
    const mainSitemapEntries = await writeSplitSitemaps(
      filteredMainUrls,
      OUTPUT_DIR,
      'sitemap',
      convertToXML,
      `${APP_BASE}/sitemaps`
    )
    sitemapIndex.push(...mainSitemapEntries)
    
    console.log(`✅ Main sitemap generated with ${filteredMainUrls.length} URLs`)
    if (mainSitemapEntries.length > 1) {
      console.log(`   📄 Split into ${mainSitemapEntries.length} files due to size limits`)
    }
    
    // Generate state sitemaps (skip if main-only mode)
    let stateCount = 0
    let stateUrlsTotal = 0
    const stateUrlsForValidation = []
    
    if (!mainOnly) {
      console.log('\n📝 Generating state sitemaps...')
      
      for (let index = 0; index < flatStates.length; index++) {
      const state = flatStates[index].toLowerCase()
      process.stdout.write(`  Processing ${state.toUpperCase()}... `)
      
      try {
        let stateUrls = await generateStateSitemap(state, index)
        if (Array.isArray(stateUrls) && stateUrls.length > 0) {
          // Store URLs for later validation
          if (validate) {
            stateUrlsForValidation.push(...stateUrls)
          }
          
          const stateDir = path.join(OUTPUT_DIR, 'state', state, 'sitemap')
          
          // Write state sitemap with size limit handling
          const stateSitemapEntries = await writeSplitSitemaps(
            stateUrls,
            stateDir,
            index.toString(),
            convertToXML,
            `${APP_BASE}/sitemaps/state/${state}/sitemap`
          )
          sitemapIndex.push(...stateSitemapEntries)
          
          stateCount++
          stateUrlsTotal += stateUrls.length
          allUrls.push(...stateUrls)
          
          if (stateSitemapEntries.length > 1) {
            console.log(`✅ ${stateUrls.length} URLs (split into ${stateSitemapEntries.length} files)`)
          } else {
            console.log(`✅ ${stateUrls.length} URLs`)
          }
        } else {
          console.log('⚠️  No data')
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`)
      }
      }
      console.log(`✅ Generated ${stateCount} state sitemaps with ${stateUrlsTotal} total URLs`)
      
      // Validate state URLs if needed
      if (validate && stateUrlsForValidation.length > 0) {
        console.log('\n🔍 Validating state sitemap URLs...')
        const stateValidationResults = await validateUrls(stateUrlsForValidation, validationOptions)
        if (!validationReport) {
          validationReport = generateValidationReport(stateValidationResults)
        } else {
          // Merge results
          validationReport.summary.total += stateValidationResults.summary.total
          validationReport.summary.valid += stateValidationResults.summary.valid
          validationReport.summary.invalid += stateValidationResults.summary.invalid
          validationReport.invalidUrls.push(...stateValidationResults.summary.errors.map(e => ({
            url: e.url,
            status: e.status,
            message: e.statusText,
            duration: e.duration
          })))
        }
        
        const invalidCount = stateValidationResults.summary.invalid
        if (invalidCount > 0) {
          console.log(`   ⚠️  Found ${invalidCount} invalid URLs in state sitemaps`)
          console.log(`   Note: Invalid URLs were kept in sitemaps for debugging. Use validation report to fix them.`)
        }
      }
    } else {
      console.log('\n⏭️  Skipping state sitemaps (main-only mode)')
    }
    
    // Generate candidate sitemaps (skip if main-only mode)
    let candidateCount = 0
    let candidateUrlsTotal = 0
    const candidateUrlsForValidation = []
    
    if (!mainOnly) {
      console.log('\n📝 Generating candidate sitemaps...')
      
      for (let index = 0; index < flatStates.length; index++) {
      const state = flatStates[index].toLowerCase()
      process.stdout.write(`  Processing ${state.toUpperCase()}... `)
      
      try {
        let candidateUrls = await generateCandidateSitemap(state, index)
        if (Array.isArray(candidateUrls) && candidateUrls.length > 0) {
          // Store URLs for later validation
          if (validate) {
            candidateUrlsForValidation.push(...candidateUrls)
          }
          
          const candidateDir = path.join(OUTPUT_DIR, 'candidates', state, 'sitemap')
          
          // Write candidate sitemap with size limit handling
          const candidateSitemapEntries = await writeSplitSitemaps(
            candidateUrls,
            candidateDir,
            index.toString(),
            convertToXML,
            `${APP_BASE}/sitemaps/candidates/${state}/sitemap`
          )
          sitemapIndex.push(...candidateSitemapEntries)
          
          candidateCount++
          candidateUrlsTotal += candidateUrls.length
          allUrls.push(...candidateUrls)
          
          if (candidateSitemapEntries.length > 1) {
            console.log(`✅ ${candidateUrls.length} URLs (split into ${candidateSitemapEntries.length} files)`)
          } else {
            console.log(`✅ ${candidateUrls.length} URLs`)
          }
        } else {
          console.log('⚠️  No data')
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`)
      }
      }
      console.log(`✅ Generated ${candidateCount} candidate sitemaps with ${candidateUrlsTotal} total URLs`)
      
      // Validate candidate URLs if needed
      if (validate && candidateUrlsForValidation.length > 0) {
        console.log('\n🔍 Validating candidate sitemap URLs...')
        const candidateValidationResults = await validateUrls(candidateUrlsForValidation, validationOptions)
        if (!validationReport) {
          validationReport = generateValidationReport(candidateValidationResults)
        } else {
          // Merge results
          validationReport.summary.total += candidateValidationResults.summary.total
          validationReport.summary.valid += candidateValidationResults.summary.valid
          validationReport.summary.invalid += candidateValidationResults.summary.invalid
          validationReport.invalidUrls.push(...candidateValidationResults.summary.errors.map(e => ({
            url: e.url,
            status: e.status,
            message: e.statusText,
            duration: e.duration
          })))
        }
        
        const invalidCount = candidateValidationResults.summary.invalid
        if (invalidCount > 0) {
          console.log(`   ⚠️  Found ${invalidCount} invalid URLs in candidate sitemaps`)
          console.log(`   Note: Invalid URLs were kept in sitemaps for debugging. Use validation report to fix them.`)
        }
      }
    } else {
      console.log('\n⏭️  Skipping candidate sitemaps (main-only mode)')
    }
    
    // Generate root sitemap index
    console.log('\n📝 Generating sitemap index...')
    const indexXml = generateRootIndex(sitemapIndex)
    
    // Write the index to the root sitemap.xml location (main entry point)
    await writeSitemapXML(path.join(process.cwd(), 'public', 'sitemap.xml'), indexXml)
    
    console.log(`✅ Sitemap index generated with ${sitemapIndex.length} sitemaps`)
    
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    console.log(`\n🎉 Sitemap generation completed in ${duration}s`)
    console.log(`📁 Files saved to: ${OUTPUT_DIR}`)
    console.log('\n📊 Summary:')
    console.log(`   Total sitemaps: ${sitemapIndex.length}`)
    console.log(`   Total URLs: ${filteredMainUrls.length + stateUrlsTotal + candidateUrlsTotal}`)
    console.log(`   - Main sitemap: ${filteredMainUrls.length} URLs`)
    console.log(`   - State sitemaps: ${stateCount} files, ${stateUrlsTotal} URLs`)
    console.log(`   - Candidate sitemaps: ${candidateCount} files, ${candidateUrlsTotal} URLs`)
    
    // Generate summary report
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      environment: process.env.NODE_ENV || 'production',
      appBase: APP_BASE,
      sitemaps: {
        total: sitemapIndex.length,
        main: 1,
        states: stateCount,
        candidates: candidateCount
      },
      urls: {
        main: filteredMainUrls.length,
        states: stateUrlsTotal,
        candidates: candidateUrlsTotal,
        total: allUrls.length
      },
      outputDirectory: OUTPUT_DIR
    }
    
    // Add validation results to report if available
    if (validationReport) {
      report.validation = {
        enabled: true,
        summary: validationReport.summary,
        invalidUrls: validationReport.invalidUrls.length,
        avgResponseTime: validationReport.summary.avgResponseTime
      }
    }
    
    // Create timestamped filename for generation report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const generationReportFilename = `generation-report-${timestamp}.json`
    const generationReportPath = path.join(OUTPUT_DIR, generationReportFilename)
    
    await fs.writeFile(
      generationReportPath,
      JSON.stringify(report, null, 2)
    )
    
    console.log(`\n📊 Generation report saved to: ${path.relative(process.cwd(), generationReportPath)}`)
    
    // Save detailed validation report if validation was performed
    if (validationReport) {
      // Create timestamped filename for validation report
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const validationReportFilename = `validation-report-${timestamp}.json`
      const validationReportPath = path.join(OUTPUT_DIR, validationReportFilename)
      
      await fs.writeFile(
        validationReportPath,
        JSON.stringify(validationReport, null, 2)
      )
      console.log('📊 Validation report saved to:', validationReportPath)
      
      if (validationReport.summary.invalid > 0) {
        console.log('\n⚠️  WARNING: Found invalid URLs in sitemaps!')
        console.log(`   Check ${validationReportFilename} for details`)
        console.log(`   Invalid URLs: ${validationReport.summary.invalid}`)
        console.log(`   Success rate: ${(validationReport.summary.successRate * 100).toFixed(1)}%`)
      }
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error during sitemap generation:', error)
    process.exit(1)
  }
}

// Handle CLI flags
const args = process.argv.slice(2)
const shouldValidate = args.includes('--validate')
const mainOnly = args.includes('--main-only')

// Parse redirect handling options
const redirectHandling = args.find(arg => arg.startsWith('--redirect-handling='))?.split('=')[1] || 'remove'
const maxRedirects = parseInt(args.find(arg => arg.startsWith('--max-redirects='))?.split('=')[1] || '5')
const followRedirects = !args.includes('--no-follow-redirects')

// Validation options
const cliValidationOptions = {
  concurrency: 20,
  followRedirects,
  maxRedirects,
  redirectHandling,
  deduplicateReplacements: true
}

// Run the generator
generateSitemaps({ 
  validate: shouldValidate,
  mainOnly,
  validationOptions: cliValidationOptions
}).catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
}) 