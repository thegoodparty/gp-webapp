/**
 * Enhanced URL validation utilities with redirect following for sitemap generation
 * This implementation supports removing ALL redirects from sitemaps (SEO best practice)
 * and replacing them with their final destinations while handling deduplication
 */

import type nodeFetch from 'node-fetch'

type FetchFunction = typeof nodeFetch

interface ValidationOptions {
  timeout?: number
  followRedirects?: boolean
  maxRedirects?: number
  redirectTimeout?: number
  redirectHandling?: 'remove' | 'replace' | 'keep'
  deduplicateReplacements?: boolean
  concurrency?: number
  onProgress?: (progress: ProgressInfo) => void
  stopOnError?: boolean
}

interface ProgressInfo {
  current: number
  total: number
  progress: number
  url: string
  valid: boolean
  status: number | null
  finalStatus?: number | null
  redirectCount?: number
  shouldIncludeInSitemap?: boolean
  replacementUrl?: string | null
}

interface SingleValidationResult {
  url: string
  status: number | null
  statusText: string
  duration: number
  redirectLocation?: string | null
  valid: boolean
  error?: string
  timestamp: string
}

// RedirectChainStep interface - kept for potential future use
// interface RedirectChainStep {
//   url: string
//   status: number | null
//   redirectLocation?: string | null
//   duration: number
// }

interface EnhancedValidationResult {
  url: string
  valid: boolean
  status: number | null
  statusText?: string
  finalUrl: string
  finalStatus: number | null
  finalStatusText?: string
  redirectChain: SingleValidationResult[]
  redirectCount: number
  duration: number
  timestamp: string
  shouldIncludeInSitemap: boolean
  replacementUrl: string | null
  redirectType: 'successful' | 'broken' | 'none'
  error?: string
  duplicateReplacement?: boolean
}

interface RedirectStats {
  totalRedirects: number
  successfulRedirects: number
  brokenRedirects: number
  circularRedirects: number
  tooManyRedirects: number
  redirectDepths: Partial<Record<number, number>>
  redirectsRemoved: number
  redirectsReplaced: number
  duplicatesFound: number
  retriedUrls?: number
  retriedSuccesses?: number
}

interface ValidationSummary {
  total: number
  valid: number
  invalid: number
  sitemapIncluded: number
  successRate: number
  sitemapInclusionRate: number
  errors: EnhancedValidationResult[]
  redirectStats: RedirectStats
  retryStats: {
    retriedUrls: number | undefined
    retriedSuccesses: number | undefined
    retrySuccessRate: number
  }
  avgResponseTime?: number
}

interface EnhancedValidationResults {
  results: EnhancedValidationResult[]
  summary: ValidationSummary
}

interface ValidationReportEntry {
  url: string
  status: number | null
  finalStatus?: number | null
  message?: string
  error?: string
  statusText?: string
  duration: number
  redirectCount?: number
}

interface ProblematicRedirect {
  url: string
  chain: Array<{
    url: string
    status: number | null
    location?: string | null
  }>
  finalStatus: number | null
  error?: string
}

interface EnhancedValidationReport {
  timestamp: string
  summary: ValidationSummary & { avgResponseTime: number }
  byStatus: Partial<Record<string, EnhancedValidationResult[]>>
  byFinalStatus: Partial<Record<string, EnhancedValidationResult[]>>
  invalidUrls: ValidationReportEntry[]
  problematicRedirects: ProblematicRedirect[]
  validUrls?: ValidationReportEntry[]
  allRedirectChains?: Array<{
    url: string
    valid: boolean
    chain: Array<{
      url: string
      status: number | null
      location?: string | null
    }>
  }>
}

interface SitemapUrlObject {
  url: string
  lastModified?: Date | string
  changeFrequency?: string
  priority?: number
}

interface ProcessedUrlsResult {
  processedUrls: (string | SitemapUrlObject)[]
  removedUrls: Array<{
    url: string
    reason: string
    redirectCount: number
    finalStatus: number | null
  }>
  replacedUrls: Array<{
    original: string
    replacement: string
    redirectCount: number
  }>
  summary: {
    originalCount: number
    processedCount: number
    removedCount: number
    replacedCount: number
  }
}

/**
 * Create a fetch wrapper from dynamic import
 */
const createFetchWrapper = async () => {
  const nodeFetchModule = await import('node-fetch')
  return nodeFetchModule.default
}

/**
 * Check if a status code is a redirect
 */
const isRedirect = (status: number | null): boolean => {
  if (status === null) return false
  return [301, 302, 303, 307, 308].includes(status)
}

/**
 * Resolve a URL against a base URL (handles relative redirects)
 */
const resolveUrl = (base: string, location: string): string => {
  if (location.startsWith('http://') || location.startsWith('https://')) {
    return location
  }

  const url = new URL(base)

  if (location.startsWith('//')) {
    return url.protocol + location
  }

  if (location.startsWith('/')) {
    return url.protocol + '//' + url.host + location
  }

  const basePath = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1)
  return url.protocol + '//' + url.host + basePath + location
}

/**
 * Validate a single URL without following redirects
 */
const validateSingleUrl = async (
  url: string,
  fetch: FetchFunction,
  options: { timeout?: number } = {},
): Promise<SingleValidationResult> => {
  const { timeout = 10000 } = options
  const startTime = Date.now()

  const createAbortController = (): AbortController => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)
    return controller
  }

  try {
    let controller = createAbortController()
    let response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'manual',
    })

    if (response.status === 405 || response.status === 501) {
      controller = createAbortController()
      response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'manual',
      })
    }

    const duration = Date.now() - startTime

    return {
      url,
      status: response.status,
      statusText: response.statusText,
      duration,
      redirectLocation: response.headers.get('location'),
      valid: response.status === 200,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return {
      url,
      status: null,
      statusText: errorMessage,
      duration,
      valid: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Create an error result object
 */
const createErrorResult = (
  url: string,
  error: string,
  redirectChain: SingleValidationResult[] = [],
): EnhancedValidationResult => {
  const firstChainItem = redirectChain[0]
  return {
    url,
    valid: false,
    status: firstChainItem ? firstChainItem.status : null,
    finalUrl: url,
    finalStatus: null,
    redirectChain,
    redirectCount: redirectChain.length,
    duration: redirectChain.reduce((sum, r) => sum + r.duration, 0),
    timestamp: new Date().toISOString(),
    shouldIncludeInSitemap: false,
    replacementUrl: null,
    redirectType: 'broken',
    error,
  }
}

/**
 * Enhanced URL validation that follows redirects
 */
const validateUrlWithRedirects = async (
  url: string,
  fetch: FetchFunction,
  options: ValidationOptions = {},
): Promise<EnhancedValidationResult> => {
  const {
    maxRedirects = 5,
    redirectTimeout = 10000,
    followRedirects = true,
    redirectHandling = 'remove',
  } = options

  if (!followRedirects) {
    const result = await validateSingleUrl(url, fetch, {
      timeout: redirectTimeout,
    })
    return {
      ...result,
      finalUrl: url,
      finalStatus: result.status,
      redirectChain: [result],
      redirectCount: 0,
      shouldIncludeInSitemap: result.valid,
      replacementUrl: null,
      redirectType: 'none',
    }
  }

  const redirectChain: SingleValidationResult[] = []
  const visitedUrls = new Set<string>()
  let currentUrl = url
  let redirectCount = 0

  while (redirectCount <= maxRedirects) {
    if (visitedUrls.has(currentUrl)) {
      return createErrorResult(
        url,
        `Circular redirect detected: ${currentUrl}`,
        redirectChain,
      )
    }
    visitedUrls.add(currentUrl)

    const result = await validateSingleUrl(currentUrl, fetch, {
      timeout: redirectTimeout,
    })
    redirectChain.push(result)

    if (!isRedirect(result.status)) {
      const totalDuration = redirectChain.reduce(
        (sum, r) => sum + r.duration,
        0,
      )
      const hasRedirects = redirectCount > 0

      let shouldIncludeInSitemap = false
      let replacementUrl: string | null = null

      if (!hasRedirects) {
        shouldIncludeInSitemap = result.valid
      } else {
        switch (redirectHandling) {
          case 'remove':
            shouldIncludeInSitemap = false
            break
          case 'replace':
            if (result.valid) {
              shouldIncludeInSitemap = true
              replacementUrl = currentUrl
            }
            break
          case 'keep':
            shouldIncludeInSitemap = result.valid
            break
          default:
            shouldIncludeInSitemap = false
        }
      }

      const firstItem = redirectChain[0]
      return {
        url,
        valid: result.valid,
        status: firstItem ? firstItem.status : null,
        finalUrl: currentUrl,
        finalStatus: result.status,
        finalStatusText: result.statusText,
        redirectChain,
        redirectCount,
        duration: totalDuration,
        timestamp: new Date().toISOString(),
        shouldIncludeInSitemap,
        replacementUrl,
        redirectType: hasRedirects
          ? result.valid
            ? 'successful'
            : 'broken'
          : 'none',
        error:
          !result.valid && redirectCount > 0
            ? `Redirect chain leads to ${result.status || 'error'}: ${
                result.statusText
              }`
            : result.error,
      }
    }

    if (!result.redirectLocation) {
      return createErrorResult(
        url,
        `Redirect ${result.status} without Location header`,
        redirectChain,
      )
    }

    currentUrl = resolveUrl(currentUrl, result.redirectLocation)
    redirectCount++
  }

  return createErrorResult(
    url,
    `Too many redirects (>${maxRedirects})`,
    redirectChain,
  )
}

/**
 * Enhanced validation of multiple URLs with redirect following and deduplication
 */
const validateUrlsEnhanced = async (
  urls: (string | SitemapUrlObject)[],
  options: ValidationOptions = {},
): Promise<EnhancedValidationResults> => {
  const {
    concurrency = 10,
    onProgress = () => {},
    stopOnError = false,
    followRedirects = true,
    maxRedirects = 5,
    redirectTimeout = 10000,
    redirectHandling = 'remove',
    deduplicateReplacements = true,
  } = options

  const nodeFetch = await createFetchWrapper()
  const pLimit = (await import('p-limit')).default
  const limit = pLimit(concurrency)

  const urlStrings = urls.map((item) =>
    typeof item === 'string' ? item : item.url,
  )

  const totalUrls = urlStrings.length
  let processedCount = 0
  const results: EnhancedValidationResult[] = []
  const errors: EnhancedValidationResult[] = []
  const redirectStats: RedirectStats = {
    totalRedirects: 0,
    successfulRedirects: 0,
    brokenRedirects: 0,
    circularRedirects: 0,
    tooManyRedirects: 0,
    redirectDepths: {},
    redirectsRemoved: 0,
    redirectsReplaced: 0,
    duplicatesFound: 0,
  }

  console.log(`\n🔍 Validating ${totalUrls} URLs with redirect following...`)
  console.log(`   Concurrency: ${concurrency}`)
  console.log(`   Follow redirects: ${followRedirects}`)
  console.log(`   Max redirects: ${maxRedirects}`)
  console.log(`   Redirect handling: ${redirectHandling}`)
  console.log(`   Deduplicate replacements: ${deduplicateReplacements}`)

  const validationPromises = urlStrings.map((url) =>
    limit(async () => {
      const result = await validateUrlWithRedirects(url, nodeFetch, {
        followRedirects,
        maxRedirects,
        redirectTimeout,
        redirectHandling,
      })

      processedCount++
      results.push(result)

      if (result.redirectCount > 0) {
        redirectStats.totalRedirects++
        redirectStats.redirectDepths[result.redirectCount] =
          (redirectStats.redirectDepths[result.redirectCount] || 0) + 1

        if (result.redirectType === 'successful') {
          redirectStats.successfulRedirects++
        } else if (result.redirectType === 'broken') {
          redirectStats.brokenRedirects++
        }

        if (result.error && result.error.includes('Circular redirect')) {
          redirectStats.circularRedirects++
        }

        if (result.error && result.error.includes('Too many redirects')) {
          redirectStats.tooManyRedirects++
        }

        if (!result.shouldIncludeInSitemap && !result.replacementUrl) {
          redirectStats.redirectsRemoved++
        }

        if (result.replacementUrl) {
          redirectStats.redirectsReplaced++
        }
      }

      if (!result.valid) {
        errors.push(result)
      }

      const progress = Math.round((processedCount / totalUrls) * 100)
      onProgress({
        current: processedCount,
        total: totalUrls,
        progress,
        url,
        valid: result.valid,
        status: result.status,
        finalStatus: result.finalStatus,
        redirectCount: result.redirectCount,
        shouldIncludeInSitemap: result.shouldIncludeInSitemap,
        replacementUrl: result.replacementUrl,
      })

      if (progress % 10 === 0 || !result.valid || result.redirectCount > 0) {
        const emoji = result.valid ? '✅' : '❌'
        const statusInfo = result.status ? `(${result.status})` : '(ERROR)'

        if (result.redirectCount > 0) {
          const redirectInfo = `[${result.redirectCount} redirect${
            result.redirectCount > 1 ? 's' : ''
          }]`
          const finalInfo = result.finalStatus
            ? `→ ${result.finalStatus}`
            : '→ ERROR'

          let action = ''
          if (result.replacementUrl) {
            action = ` → REPLACE with ${result.replacementUrl}`
          } else if (!result.shouldIncludeInSitemap) {
            action = ` → REMOVE from sitemap`
          }

          console.log(
            `  ${emoji} ${url} ${statusInfo} ${redirectInfo} ${finalInfo}${action}`,
          )
        } else if (!result.valid) {
          console.log(
            `  ${emoji} ${url} ${statusInfo} - ${
              result.statusText || result.error
            }`,
          )
        } else if (progress % 10 === 0) {
          console.log(
            `  Progress: ${progress}% (${processedCount}/${totalUrls})`,
          )
        }
      }

      if (stopOnError && !result.valid) {
        throw new Error(
          `Validation failed for ${url}: ${result.error || result.statusText}`,
        )
      }

      return result
    }),
  )

  try {
    await Promise.all(validationPromises)
  } catch (error) {
    if (stopOnError) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      console.error(`\n❌ Validation stopped due to error: ${errorMessage}`)
    }
  }

  if (deduplicateReplacements && redirectHandling === 'replace') {
    const finalUrlCounts = new Map<string, number>()

    results.forEach((result) => {
      if (result.replacementUrl) {
        finalUrlCounts.set(
          result.replacementUrl,
          (finalUrlCounts.get(result.replacementUrl) || 0) + 1,
        )
      }
    })

    const duplicateUrls = new Set<string>()
    finalUrlCounts.forEach((count, url) => {
      if (count > 1) {
        duplicateUrls.add(url)
        redirectStats.duplicatesFound += count - 1
      }
    })

    const seenReplacements = new Set<string>()
    results.forEach((result) => {
      if (result.replacementUrl && duplicateUrls.has(result.replacementUrl)) {
        if (seenReplacements.has(result.replacementUrl)) {
          result.shouldIncludeInSitemap = false
          result.replacementUrl = null
          result.duplicateReplacement = true
        } else {
          seenReplacements.add(result.replacementUrl)
        }
      }
    })
  }

  const validCount = results.filter((r) => r.valid).length
  const invalidCount = results.filter((r) => !r.valid).length
  const sitemapIncludeCount = results.filter(
    (r) => r.shouldIncludeInSitemap,
  ).length

  console.log(`\n✅ Validation complete:`)
  console.log(`   Valid URLs: ${validCount}`)
  console.log(`   Invalid URLs: ${invalidCount}`)
  console.log(`   URLs for sitemap: ${sitemapIncludeCount}`)
  console.log(
    `   Success rate: ${((validCount / totalUrls) * 100).toFixed(1)}%`,
  )
  console.log(
    `   Sitemap inclusion rate: ${(
      (sitemapIncludeCount / totalUrls) *
      100
    ).toFixed(1)}%`,
  )

  if (followRedirects && redirectStats.totalRedirects > 0) {
    console.log(`\n🔄 Redirect Statistics:`)
    console.log(`   Total URLs with redirects: ${redirectStats.totalRedirects}`)
    console.log(`   Successful redirects: ${redirectStats.successfulRedirects}`)
    console.log(`   Broken redirects: ${redirectStats.brokenRedirects}`)
    console.log(`   Circular redirects: ${redirectStats.circularRedirects}`)
    console.log(`   Too many redirects: ${redirectStats.tooManyRedirects}`)
    console.log(`   Redirects removed: ${redirectStats.redirectsRemoved}`)
    console.log(`   Redirects replaced: ${redirectStats.redirectsReplaced}`)
    console.log(`   Duplicates found: ${redirectStats.duplicatesFound}`)
    console.log(`   Redirect depths:`)
    Object.entries(redirectStats.redirectDepths)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([depth, count]) => {
        console.log(
          `     ${depth} redirect${
            Number(depth) > 1 ? 's' : ''
          }: ${count} URLs`,
        )
      })
  }

  return {
    results,
    summary: {
      total: totalUrls,
      valid: validCount,
      invalid: invalidCount,
      sitemapIncluded: sitemapIncludeCount,
      successRate: validCount / totalUrls,
      sitemapInclusionRate: sitemapIncludeCount / totalUrls,
      errors,
      redirectStats,
      retryStats: {
        retriedUrls: redirectStats.retriedUrls,
        retriedSuccesses: redirectStats.retriedSuccesses,
        retrySuccessRate: redirectStats.retriedUrls
          ? redirectStats.retriedSuccesses! / redirectStats.retriedUrls
          : 0,
      },
    },
  }
}

/**
 * Generate enhanced validation report with redirect analysis
 */
const generateEnhancedValidationReport = (
  validationResults: EnhancedValidationResults,
  options: { includeValid?: boolean; includeRedirectChains?: boolean } = {},
): EnhancedValidationReport => {
  const { results, summary } = validationResults
  const { includeValid = false, includeRedirectChains = true } = options

  const byStatus = results.reduce<
    Partial<Record<string, EnhancedValidationResult[]>>
  >((acc, result) => {
    const status = String(result.status || 'ERROR')
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status]!.push(result)
    return acc
  }, {})

  const byFinalStatus = results.reduce<
    Partial<Record<string, EnhancedValidationResult[]>>
  >((acc, result) => {
    const status = String(result.finalStatus || result.status || 'ERROR')
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status]!.push(result)
    return acc
  }, {})

  const problematicRedirects: ProblematicRedirect[] = results
    .filter((r) => r.redirectCount > 0 && !r.valid)
    .map((r) => ({
      url: r.url,
      chain: r.redirectChain.map((step) => ({
        url: step.url,
        status: step.status,
        location: step.redirectLocation,
      })),
      finalStatus: r.finalStatus,
      error: r.error,
    }))

  const validResults = results.filter((r) => r.valid)
  const avgResponseTime =
    validResults.length > 0
      ? validResults.reduce((sum, r) => sum + r.duration, 0) /
        validResults.length
      : 0

  const report: EnhancedValidationReport = {
    timestamp: new Date().toISOString(),
    summary: {
      ...summary,
      avgResponseTime: Math.round(avgResponseTime),
    },
    byStatus,
    byFinalStatus,
    invalidUrls: summary.errors.map((e) => ({
      url: e.url,
      status: e.status,
      finalStatus: e.finalStatus,
      message: e.error || e.statusText,
      duration: e.duration,
      redirectCount: e.redirectCount,
    })),
    problematicRedirects,
  }

  if (includeValid) {
    report.validUrls = results
      .filter((r) => r.valid)
      .map((r) => ({
        url: r.url,
        status: r.status,
        finalStatus: r.finalStatus,
        duration: r.duration,
        redirectCount: r.redirectCount,
      }))
  }

  if (includeRedirectChains) {
    report.allRedirectChains = results
      .filter((r) => r.redirectCount > 0)
      .map((r) => ({
        url: r.url,
        valid: r.valid,
        chain: r.redirectChain.map((step) => ({
          url: step.url,
          status: step.status,
          location: step.redirectLocation,
        })),
      }))
  }

  return report
}

/**
 * Process URL validation results for sitemap generation
 */
const processUrlsForSitemap = (
  validationResults: EnhancedValidationResults,
  originalUrls: (string | SitemapUrlObject)[],
): ProcessedUrlsResult => {
  const { results } = validationResults
  const processedUrls: (string | SitemapUrlObject)[] = []
  const removedUrls: ProcessedUrlsResult['removedUrls'] = []
  const replacedUrls: ProcessedUrlsResult['replacedUrls'] = []

  const originalUrlMap = new Map<string, string | SitemapUrlObject>()
  originalUrls.forEach((urlObj) => {
    const url = typeof urlObj === 'string' ? urlObj : urlObj.url
    originalUrlMap.set(url, urlObj)
  })

  results.forEach((result) => {
    const originalUrlObj = originalUrlMap.get(result.url)

    if (result.shouldIncludeInSitemap) {
      if (result.replacementUrl) {
        const replacedUrlObj =
          typeof originalUrlObj === 'string'
            ? result.replacementUrl
            : { ...originalUrlObj, url: result.replacementUrl }

        processedUrls.push(replacedUrlObj)
        replacedUrls.push({
          original: result.url,
          replacement: result.replacementUrl,
          redirectCount: result.redirectCount,
        })
      } else if (originalUrlObj) {
        processedUrls.push(originalUrlObj)
      }
    } else {
      removedUrls.push({
        url: result.url,
        reason: result.error || `${result.redirectType} redirect`,
        redirectCount: result.redirectCount,
        finalStatus: result.finalStatus,
      })
    }
  })

  return {
    processedUrls,
    removedUrls,
    replacedUrls,
    summary: {
      originalCount: originalUrls.length,
      processedCount: processedUrls.length,
      removedCount: removedUrls.length,
      replacedCount: replacedUrls.length,
    },
  }
}

/**
 * Enhanced filter function that handles redirects
 */
const filterValidUrls = (
  urlObjects: (string | SitemapUrlObject)[],
  validationResults: EnhancedValidationResults | EnhancedValidationResult[],
): (string | SitemapUrlObject)[] => {
  if (Array.isArray(validationResults)) {
    const validUrlSet = new Set(
      validationResults.filter((r) => r.valid).map((r) => r.url),
    )

    return urlObjects.filter((urlObj) =>
      validUrlSet.has(typeof urlObj === 'string' ? urlObj : urlObj.url),
    )
  } else {
    const { processedUrls } = processUrlsForSitemap(
      validationResults,
      urlObjects,
    )
    return processedUrls
  }
}

export {
  isRedirect,
  resolveUrl,
  validateUrlWithRedirects,
  validateUrlsEnhanced,
  validateUrlsEnhanced as validateUrls,
  generateEnhancedValidationReport,
  generateEnhancedValidationReport as generateValidationReport,
  processUrlsForSitemap,
  filterValidUrls,
}

export type {
  ValidationOptions,
  ProgressInfo,
  SingleValidationResult,
  EnhancedValidationResult,
  RedirectStats,
  ValidationSummary,
  EnhancedValidationResults,
  EnhancedValidationReport,
  SitemapUrlObject,
  ProcessedUrlsResult,
}

module.exports = {
  validateUrl: validateSingleUrl,
  validateUrlWithRedirects,
  validateUrlsEnhanced,
  generateEnhancedValidationReport,
  processUrlsForSitemap,
  isRedirect,
  resolveUrl,
  validateUrls: validateUrlsEnhanced,
  generateValidationReport: generateEnhancedValidationReport,
  filterValidUrls,
}
