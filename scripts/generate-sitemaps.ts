#!/usr/bin/env node

/**
 * Generate static sitemap XML files at build time
 * This script generates all sitemaps and writes them to public/sitemaps/
 */

const fs = require('fs').promises
const path = require('path')
const { generateRootIndex, convertToXML } = require('./lib/xml')
const {
  ensureDirectoryExists,
  writeSitemapXML,
  writeSplitSitemaps,
} = require('./lib/sitemap-helpers')
const {
  validateUrls,
  generateValidationReport,
  filterValidUrls,
} = require('./validate-sitemap-urls')

// Type definitions
interface SitemapUrl {
  url: string
  lastModified: Date
  changeFrequency: string
  priority: number
}

interface SitemapEntry {
  loc: string
  lastmod?: string
}

interface BlogArticle {
  slug?: string
  publishDate?: string
  section?: {
    fields?: {
      slug?: string
      title?: string
    }
  }
  fields?: {
    title?: string
    slug?: string
  }
  title?: string
}

interface BlogSection {
  slug?: string
  title?: string
  fields?: {
    slug?: string
    title?: string
  }
}

interface FaqArticle {
  fields?: {
    title?: string
  }
  title?: string
}

interface Place {
  slug?: string
}

interface Race {
  slug?: string
}

interface Candidate {
  slug?: string
}

/**
 * Type guard for Place object
 */
function isPlace(item: object): item is Place {
  return 'slug' in item || Object.keys(item).length === 0
}

/**
 * Type guard for Race object
 */
function isRace(item: object): item is Race {
  return 'slug' in item || Object.keys(item).length === 0
}

/**
 * Type guard for Candidate object
 */
function isCandidate(item: object): item is Candidate {
  return 'slug' in item || Object.keys(item).length === 0
}

interface ValidationOptions {
  concurrency?: number
  followRedirects?: boolean
  maxRedirects?: number
  redirectHandling?: string
  deduplicateReplacements?: boolean
}

interface ValidationResult {
  url: string
  status?: number | null
  statusText?: string
  duration?: number
}

interface ValidationSummary {
  total: number
  valid: number
  invalid: number
  successRate: number
  avgResponseTime: number
  errors: ValidationResult[]
}

interface ValidationResults {
  summary: ValidationSummary
}

interface ValidationReport {
  summary: ValidationSummary
  invalidUrls: ValidationResult[]
}

interface GenerateSitemapsOptions {
  validate?: boolean
  validationOptions?: ValidationOptions
  mainOnly?: boolean
  candidatesOnly?: boolean
}

type Environment = 'production' | 'development' | 'test'
const VALID_ENVIRONMENTS: readonly string[] = [
  'production',
  'development',
  'test',
]

function isValidEnvironment(value: string): value is Environment {
  return VALID_ENVIRONMENTS.includes(value)
}

function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'production'
  return isValidEnvironment(env) ? env : 'production'
}

interface GenerationReport {
  timestamp: string
  duration: string
  environment: 'production' | 'development' | 'test'
  appBase: string
  sitemaps: {
    total: number
    main: number
    states: number
    candidates: number
  }
  urls: {
    main: number
    states: number
    candidates: number
    total: number
  }
  outputDirectory: string
  validation?: {
    enabled: boolean
    summary: ValidationSummary
    invalidUrls: number
    avgResponseTime: number
  }
}

// Environment variables
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || 'https://goodparty.org'
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://gp-api.goodparty.org'
const ELECTION_API_BASE =
  process.env.NEXT_PUBLIC_ELECTION_API_BASE ||
  'https://election-api.goodparty.org'

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps')

// States array
const flatStates = [
  'AK',
  'AL',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
]

// Alphabet for political terms
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

// JSON primitive and compound types for API responses
type JSONPrimitive = string | number | boolean | null
type JSONArray = JSONValue[]
type JSONObject = { [key: string]: JSONValue | undefined }
type JSONValue = JSONPrimitive | JSONArray | JSONObject

/**
 * Type guard to check if a value is a valid JSON value
 */
function isJSONValue(value: unknown): value is JSONValue {
  if (value === null) return true
  const type = typeof value
  if (type === 'string' || type === 'number' || type === 'boolean') return true
  if (Array.isArray(value)) return true
  if (type === 'object') return true
  return false
}

/**
 * Simple fetch implementation for Node.js with proper error handling
 */
async function fetchData(url: string): Promise<JSONValue> {
  const fetch = (await import('node-fetch')).default
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText} for ${url}`,
    )
  }

  const data = await response.json()
  if (!isJSONValue(data)) {
    throw new Error(`Invalid JSON response from ${url}`)
  }
  return data
}

/**
 * Build query string from params object
 */
function buildQueryString(params: Partial<Record<string, string>>): string {
  const entries: [string, string][] = []
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      entries.push([key, value])
    }
  }
  return entries.length > 0 ? `?${new URLSearchParams(entries)}` : ''
}

/**
 * Fetch data from GP API
 */
async function fetchGPData(
  apiPath: string,
  params: Partial<Record<string, string>> = {},
): Promise<JSONValue> {
  const queryString = buildQueryString(params)
  const url = `${API_BASE}${apiPath}${queryString}`
  return await fetchData(url)
}

/**
 * Fetch data from Election API
 */
async function fetchElectionData(
  apiPath: string,
  params: Partial<Record<string, string>> = {},
): Promise<JSONValue> {
  const queryString = buildQueryString(params)
  const url = `${ELECTION_API_BASE}/v1${apiPath}${queryString}`
  return await fetchData(url)
}

/**
 * Convert JSONValue to BlogArticle if valid
 */
function toBlogArticle(item: JSONValue): BlogArticle | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  const obj = item
  return {
    slug: typeof obj.slug === 'string' ? obj.slug : undefined,
    publishDate:
      typeof obj.publishDate === 'string' ? obj.publishDate : undefined,
    section:
      obj.section &&
      typeof obj.section === 'object' &&
      !Array.isArray(obj.section)
        ? {
            fields:
              obj.section.fields &&
              typeof obj.section.fields === 'object' &&
              !Array.isArray(obj.section.fields)
                ? {
                    slug:
                      typeof obj.section.fields.slug === 'string'
                        ? obj.section.fields.slug
                        : undefined,
                    title:
                      typeof obj.section.fields.title === 'string'
                        ? obj.section.fields.title
                        : undefined,
                  }
                : undefined,
          }
        : undefined,
    fields:
      obj.fields && typeof obj.fields === 'object' && !Array.isArray(obj.fields)
        ? {
            title:
              typeof obj.fields.title === 'string'
                ? obj.fields.title
                : undefined,
            slug:
              typeof obj.fields.slug === 'string' ? obj.fields.slug : undefined,
          }
        : undefined,
    title: typeof obj.title === 'string' ? obj.title : undefined,
  }
}

/**
 * Fetch blog articles
 */
async function fetchBlogArticles(): Promise<BlogArticle[]> {
  try {
    const data = await fetchGPData('/v1/content/type/blogArticle')
    if (!Array.isArray(data)) return []
    const articles: BlogArticle[] = []
    for (const item of data) {
      const article = toBlogArticle(item)
      if (article) articles.push(article)
    }
    return articles
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error fetching blog articles:', errorMessage)
    return []
  }
}

/**
 * Extract blog sections from blog articles
 */
function extractBlogSections(blogArticles: BlogArticle[]): BlogSection[] {
  const sectionsMap = new Map<string, BlogSection>()

  blogArticles.forEach((article: BlogArticle) => {
    const sectionSlug = article.section?.fields?.slug
    if (sectionSlug) {
      const section = article.section?.fields
      if (section) {
        sectionsMap.set(sectionSlug, section)
      }
    }
  })

  return Array.from(sectionsMap.values())
}

/**
 * Fetch blog sections
 */
async function fetchBlogSections(): Promise<JSONArray> {
  try {
    const sections = await fetchGPData('/v1/content/blog-articles/by-section')
    return Array.isArray(sections) ? sections : []
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error fetching blog sections:', errorMessage)
    return []
  }
}

/**
 * Convert JSONValue to FaqArticle if valid
 */
function toFaqArticle(item: JSONValue): FaqArticle | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  const obj = item
  return {
    fields:
      obj.fields && typeof obj.fields === 'object' && !Array.isArray(obj.fields)
        ? {
            title:
              typeof obj.fields.title === 'string'
                ? obj.fields.title
                : undefined,
          }
        : undefined,
    title: typeof obj.title === 'string' ? obj.title : undefined,
  }
}

/**
 * Fetch FAQ articles
 */
async function fetchFAQArticles(): Promise<FaqArticle[]> {
  try {
    const data = await fetchGPData('/v1/content/type/faqArticle')
    if (!Array.isArray(data)) return []
    const articles: FaqArticle[] = []
    for (const item of data) {
      const article = toFaqArticle(item)
      if (article) articles.push(article)
    }
    return articles
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error fetching FAQ articles:', errorMessage)
    return []
  }
}

interface GlossaryItem {
  slug?: string
  title?: string
  fields?: {
    slug?: string
    title?: string
  }
}

/**
 * Convert JSONValue to GlossaryItem if valid
 */
function toGlossaryItem(item: JSONValue): GlossaryItem | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  const obj = item
  return {
    slug: typeof obj.slug === 'string' ? obj.slug : undefined,
    title: typeof obj.title === 'string' ? obj.title : undefined,
    fields:
      obj.fields && typeof obj.fields === 'object' && !Array.isArray(obj.fields)
        ? {
            slug:
              typeof obj.fields.slug === 'string' ? obj.fields.slug : undefined,
            title:
              typeof obj.fields.title === 'string'
                ? obj.fields.title
                : undefined,
          }
        : undefined,
  }
}

/**
 * Fetch glossary terms
 */
async function fetchGlossaryTerms(): Promise<
  Partial<Record<string, GlossaryItem>>
> {
  try {
    const glossary = await fetchGPData('/v1/content/type/glossaryItem/by-slug')

    if (!glossary || typeof glossary !== 'object' || Array.isArray(glossary)) {
      console.warn('Invalid glossary response format, using empty object')
      return {}
    }

    // Check it's not an error response
    if (
      'error' in glossary ||
      'statusCode' in glossary ||
      'message' in glossary
    ) {
      console.warn(
        'Glossary response appears to be an error object, using empty object',
      )
      return {}
    }

    // Convert each entry to GlossaryItem
    const result: Partial<Record<string, GlossaryItem>> = {}
    for (const [key, value] of Object.entries(glossary)) {
      if (value !== undefined) {
        const item = toGlossaryItem(value)
        if (item) {
          result[key] = item
        }
      }
    }
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error fetching glossary terms:', errorMessage)
    return {}
  }
}

/**
 * Generate FAQ article route (matches faqArticleRoute helper exactly)
 */
function getFaqArticleRoute(article: FaqArticle): string {
  try {
    // Match the helper function exactly: custom slugify wrapper + toLowerCase()
    const slugger = require('slugify')
    const slugify = (text: string | undefined, lowercase: boolean): string => {
      if (!text) {
        return ''
      }
      if (lowercase) {
        return slugger(text, { lower: true })
      }
      return slugger(text)
    }

    const title = article.fields?.title || article.title || ''
    if (!title) {
      return '/'
    }
    const slug = slugify(title, true)
    return `/faqs/${slug}`.toLowerCase()
  } catch (error) {
    console.error('Error generating FAQ route:', error)
    return `/faqs/unknown-${Date.now()}`
  }
}

/**
 * Generate main sitemap
 */
async function generateMainSitemap(): Promise<SitemapUrl[]> {
  const now = new Date()
  const mainSitemap: SitemapUrl[] = []

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
    fetchGlossaryTerms(),
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
          lastModified: article.publishDate
            ? new Date(article.publishDate)
            : now,
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
async function generateStateSitemap(
  state: string,
  _index: number,
): Promise<SitemapUrl[]> {
  const now = new Date()

  try {
    // Fetch places and races for this state
    const [places, races] = await Promise.all([
      fetchElectionData('/places', { state, placeColumns: 'slug' }),
      fetchElectionData('/races', { state, raceColumns: 'slug' }),
    ])

    const urls: SitemapUrl[] = []

    // Add place URLs
    if (Array.isArray(places)) {
      for (const item of places) {
        if (item && typeof item === 'object' && isPlace(item) && item.slug) {
          urls.push({
            url: `${APP_BASE}/elections/${item.slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      }
    }

    // Add race URLs
    if (Array.isArray(races)) {
      for (const item of races) {
        if (item && typeof item === 'object' && isRace(item) && item.slug) {
          urls.push({
            url: `${APP_BASE}/elections/position/${item.slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      }
    }

    return urls
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error generating state sitemap for ${state}:`, errorMessage)
    return []
  }
}

/**
 * Generate candidate sitemap
 */
async function generateCandidateSitemap(
  state: string,
  _index: number,
): Promise<SitemapUrl[]> {
  const now = new Date()

  try {
    // Fetch candidates for this state
    const candidates = await fetchElectionData('/candidacies', {
      state,
      columns: 'slug',
    })

    const urls: SitemapUrl[] = []

    // Add candidate URLs
    if (Array.isArray(candidates)) {
      for (const item of candidates) {
        if (
          item &&
          typeof item === 'object' &&
          isCandidate(item) &&
          item.slug
        ) {
          urls.push({
            url: `${APP_BASE}/candidate/${item.slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
          })
        }
      }
    }

    return urls
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      `Error generating candidate sitemap for ${state}:`,
      errorMessage,
    )
    return []
  }
}

/**
 * Main function to generate all sitemaps
 */
async function generateSitemaps(
  options: GenerateSitemapsOptions = {},
): Promise<void> {
  const {
    validate = false,
    validationOptions = {},
    mainOnly = false,
    candidatesOnly = false,
  } = options
  const startTime = Date.now()
  console.log('🚀 Starting sitemap generation...')
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
  console.log(`🌐 App base URL: ${APP_BASE}`)

  if (validate) {
    console.log('🔍 URL validation: ENABLED')
  }

  if (candidatesOnly) {
    console.log('🎯 CANDIDATES-ONLY mode: Generating only candidate sitemaps')
  } else if (mainOnly) {
    console.log('📝 MAIN-ONLY mode: Generating only main sitemap')
  }

  try {
    // Ensure output directory exists
    await ensureDirectoryExists(OUTPUT_DIR)

    // Track all generated sitemaps for the index
    const sitemapIndex: SitemapEntry[] = []

    // Track all URLs for validation
    const allUrls = []
    let validationReport = null
    let mainValidationResults = null

    // Generate main sitemap (skip if candidates-only mode)
    let mainUrls = []
    let filteredMainUrls = []

    if (!candidatesOnly) {
      console.log('\n📝 Generating main sitemap...')
      mainUrls = await generateMainSitemap()

      // Validate main sitemap URLs if validation is enabled
      if (validate) {
        console.log('\n🔍 Validating main sitemap URLs...')
        mainValidationResults = await validateUrls(mainUrls, validationOptions)
        validationReport = generateValidationReport(mainValidationResults)

        const invalidCount = mainValidationResults.summary.invalid
        if (invalidCount > 0) {
          console.log(
            `   ⚠️  Found ${invalidCount} invalid URLs in main sitemap`,
          )
          console.log(
            `   Note: Invalid URLs were kept in sitemaps for debugging. Use validation report to fix them.`,
          )
        } else {
          console.log(
            `   ✅ All ${mainValidationResults.summary.valid} main sitemap URLs are valid`,
          )
        }
      }

      allUrls.push(...mainUrls)

      // Filter main URLs based on validation results if validation was performed
      filteredMainUrls = mainUrls
      if (validate && mainValidationResults) {
        // Use the validation results to filter URLs (removes redirects, etc.)
        filteredMainUrls = filterValidUrls(mainUrls, mainValidationResults)
        const removedCount = mainUrls.length - filteredMainUrls.length
        if (removedCount > 0) {
          console.log(
            `   🗑️  Removed ${removedCount} URLs from sitemap based on validation results`,
          )
        }
      }

      // Write main sitemap with size limit handling
      const mainSitemapEntries = await writeSplitSitemaps(
        filteredMainUrls,
        OUTPUT_DIR,
        'sitemap',
        convertToXML,
        `${APP_BASE}/sitemaps`,
      )
      sitemapIndex.push(...mainSitemapEntries)

      console.log(
        `✅ Main sitemap generated with ${filteredMainUrls.length} URLs`,
      )
      if (mainSitemapEntries.length > 1) {
        console.log(
          `   📄 Split into ${mainSitemapEntries.length} files due to size limits`,
        )
      }
    } else {
      console.log('\n⏭️  Skipping main sitemap (candidates-only mode)')
    }

    // Generate state sitemaps (skip if main-only or candidates-only mode)
    let stateCount = 0
    let stateUrlsTotal = 0
    const stateUrlsForValidation: SitemapUrl[] = []

    if (!mainOnly && !candidatesOnly) {
      console.log('\n📝 Generating state sitemaps...')

      for (let index = 0; index < flatStates.length; index++) {
        const stateCode = flatStates[index]
        if (!stateCode) continue
        const state = stateCode.toLowerCase()
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
              `${APP_BASE}/sitemaps/state/${state}/sitemap`,
            )
            sitemapIndex.push(...stateSitemapEntries)

            stateCount++
            stateUrlsTotal += stateUrls.length
            allUrls.push(...stateUrls)

            if (stateSitemapEntries.length > 1) {
              console.log(
                `✅ ${stateUrls.length} URLs (split into ${stateSitemapEntries.length} files)`,
              )
            } else {
              console.log(`✅ ${stateUrls.length} URLs`)
            }
          } else {
            console.log('⚠️  No data')
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          console.log(`❌ Error: ${errorMessage}`)
        }
      }
      console.log(
        `✅ Generated ${stateCount} state sitemaps with ${stateUrlsTotal} total URLs`,
      )

      // Validate state URLs if needed
      if (validate && stateUrlsForValidation.length > 0) {
        console.log('\n🔍 Validating state sitemap URLs...')
        const stateValidationResults = await validateUrls(
          stateUrlsForValidation,
          validationOptions,
        )
        if (!validationReport) {
          validationReport = generateValidationReport(stateValidationResults)
        } else {
          // Merge results
          validationReport.summary.total += stateValidationResults.summary.total
          validationReport.summary.valid += stateValidationResults.summary.valid
          validationReport.summary.invalid +=
            stateValidationResults.summary.invalid
          validationReport.invalidUrls.push(
            ...stateValidationResults.summary.errors.map(
              (e: ValidationResult) => ({
                url: e.url,
                status: e.status,
                statusText: e.statusText,
                duration: e.duration,
              }),
            ),
          )
        }

        const invalidCount = stateValidationResults.summary.invalid
        if (invalidCount > 0) {
          console.log(
            `   ⚠️  Found ${invalidCount} invalid URLs in state sitemaps`,
          )
          console.log(
            `   Note: Invalid URLs were kept in sitemaps for debugging. Use validation report to fix them.`,
          )
        }
      }
    } else {
      if (mainOnly) {
        console.log('\n⏭️  Skipping state sitemaps (main-only mode)')
      } else if (candidatesOnly) {
        console.log('\n⏭️  Skipping state sitemaps (candidates-only mode)')
      }
    }

    // Generate candidate sitemaps (skip if main-only mode)
    let candidateCount = 0
    let candidateUrlsTotal = 0
    const candidateUrlsForValidation: SitemapUrl[] = []

    if (!mainOnly) {
      console.log('\n📝 Generating candidate sitemaps...')

      for (let index = 0; index < flatStates.length; index++) {
        const stateCode = flatStates[index]
        if (!stateCode) continue
        const state = stateCode.toLowerCase()
        process.stdout.write(`  Processing ${state.toUpperCase()}... `)

        try {
          let candidateUrls = await generateCandidateSitemap(state, index)
          if (Array.isArray(candidateUrls) && candidateUrls.length > 0) {
            // Store URLs for later validation
            if (validate) {
              candidateUrlsForValidation.push(...candidateUrls)
            }

            const candidateDir = path.join(
              OUTPUT_DIR,
              'candidates',
              state,
              'sitemap',
            )

            // Write candidate sitemap with size limit handling
            const candidateSitemapEntries = await writeSplitSitemaps(
              candidateUrls,
              candidateDir,
              index.toString(),
              convertToXML,
              `${APP_BASE}/sitemaps/candidates/${state}/sitemap`,
            )
            sitemapIndex.push(...candidateSitemapEntries)

            candidateCount++
            candidateUrlsTotal += candidateUrls.length
            allUrls.push(...candidateUrls)

            if (candidateSitemapEntries.length > 1) {
              console.log(
                `✅ ${candidateUrls.length} URLs (split into ${candidateSitemapEntries.length} files)`,
              )
            } else {
              console.log(`✅ ${candidateUrls.length} URLs`)
            }
          } else {
            console.log('⚠️  No data')
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          console.log(`❌ Error: ${errorMessage}`)
        }
      }
      console.log(
        `✅ Generated ${candidateCount} candidate sitemaps with ${candidateUrlsTotal} total URLs`,
      )

      // Validate candidate URLs if needed
      if (validate && candidateUrlsForValidation.length > 0) {
        console.log('\n🔍 Validating candidate sitemap URLs...')
        const candidateValidationResults = await validateUrls(
          candidateUrlsForValidation,
          validationOptions,
        )
        if (!validationReport) {
          validationReport = generateValidationReport(
            candidateValidationResults,
          )
        } else {
          // Merge results
          validationReport.summary.total +=
            candidateValidationResults.summary.total
          validationReport.summary.valid +=
            candidateValidationResults.summary.valid
          validationReport.summary.invalid +=
            candidateValidationResults.summary.invalid
          validationReport.invalidUrls.push(
            ...candidateValidationResults.summary.errors.map(
              (e: ValidationResult) => ({
                url: e.url,
                status: e.status,
                statusText: e.statusText,
                duration: e.duration,
              }),
            ),
          )
        }

        const invalidCount = candidateValidationResults.summary.invalid
        if (invalidCount > 0) {
          console.log(
            `   ⚠️  Found ${invalidCount} invalid URLs in candidate sitemaps`,
          )
          console.log(
            `   Note: Invalid URLs were kept in sitemaps for debugging. Use validation report to fix them.`,
          )
        }
      }
    } else {
      console.log('\n⏭️  Skipping candidate sitemaps (main-only mode)')
    }

    // Generate root sitemap index
    console.log('\n📝 Generating sitemap index...')
    const indexXml = generateRootIndex(sitemapIndex)

    // Write the index to the root sitemap.xml location (main entry point)
    await writeSitemapXML(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      indexXml,
    )

    console.log(
      `✅ Sitemap index generated with ${sitemapIndex.length} sitemaps`,
    )

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    console.log(`\n🎉 Sitemap generation completed in ${duration}s`)
    console.log(`📁 Files saved to: ${OUTPUT_DIR}`)
    console.log('\n📊 Summary:')
    console.log(`   Total sitemaps: ${sitemapIndex.length}`)
    console.log(
      `   Total URLs: ${
        filteredMainUrls.length + stateUrlsTotal + candidateUrlsTotal
      }`,
    )
    console.log(`   - Main sitemap: ${filteredMainUrls.length} URLs`)
    console.log(
      `   - State sitemaps: ${stateCount} files, ${stateUrlsTotal} URLs`,
    )
    console.log(
      `   - Candidate sitemaps: ${candidateCount} files, ${candidateUrlsTotal} URLs`,
    )

    // Generate summary report
    const report: GenerationReport = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      environment: getEnvironment(),
      appBase: APP_BASE,
      sitemaps: {
        total: sitemapIndex.length,
        main: 1,
        states: stateCount,
        candidates: candidateCount,
      },
      urls: {
        main: filteredMainUrls.length,
        states: stateUrlsTotal,
        candidates: candidateUrlsTotal,
        total: allUrls.length,
      },
      outputDirectory: OUTPUT_DIR,
    }

    // Add validation results to report if available
    if (validationReport) {
      report.validation = {
        enabled: true,
        summary: validationReport.summary,
        invalidUrls: validationReport.invalidUrls.length,
        avgResponseTime: validationReport.summary.avgResponseTime,
      }
    }

    // Create timestamped filename for generation report
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    const generationReportFilename = `generation-report-${timestamp}.json`
    const generationReportPath = path.join(OUTPUT_DIR, generationReportFilename)

    await fs.writeFile(generationReportPath, JSON.stringify(report, null, 2))

    console.log(
      `\n📊 Generation report saved to: ${path.relative(
        process.cwd(),
        generationReportPath,
      )}`,
    )

    // Save detailed validation report if validation was performed
    if (validationReport) {
      // Create timestamped filename for validation report
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5)
      const validationReportFilename = `validation-report-${timestamp}.json`
      const validationReportPath = path.join(
        OUTPUT_DIR,
        validationReportFilename,
      )

      await fs.writeFile(
        validationReportPath,
        JSON.stringify(validationReport, null, 2),
      )
      console.log('📊 Validation report saved to:', validationReportPath)

      if (validationReport.summary.invalid > 0) {
        console.log('\n⚠️  WARNING: Found invalid URLs in sitemaps!')
        console.log(`   Check ${validationReportFilename} for details`)
        console.log(`   Invalid URLs: ${validationReport.summary.invalid}`)
        console.log(
          `   Success rate: ${(
            validationReport.summary.successRate * 100
          ).toFixed(1)}%`,
        )
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
const candidatesOnly = args.includes('--candidates-only')

// Validate mutually exclusive flags
if (mainOnly && candidatesOnly) {
  console.error(
    '❌ Error: --main-only and --candidates-only flags cannot be used together',
  )
  process.exit(1)
}

// Parse redirect handling options
const redirectHandling =
  args.find((arg) => arg.startsWith('--redirect-handling='))?.split('=')[1] ||
  'remove'
const maxRedirects = parseInt(
  args.find((arg) => arg.startsWith('--max-redirects='))?.split('=')[1] || '5',
)
const followRedirects = !args.includes('--no-follow-redirects')

// Validation options
const cliValidationOptions = {
  concurrency: 20,
  followRedirects,
  maxRedirects,
  redirectHandling,
  deduplicateReplacements: true,
}

// Run the generator
generateSitemaps({
  validate: shouldValidate,
  mainOnly,
  candidatesOnly,
  validationOptions: cliValidationOptions,
}).catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
