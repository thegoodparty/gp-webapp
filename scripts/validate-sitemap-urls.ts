/**
 * Enhanced URL validation utilities with redirect following for sitemap generation
 * This implementation supports removing ALL redirects from sitemaps (SEO best practice)
 * and replacing them with their final destinations while handling deduplication
 */

/**
 * Check if a status code is a redirect
 * @param {number} status - HTTP status code
 * @returns {boolean} True if status is a redirect
 */
function isRedirect(status) {
  return [301, 302, 303, 307, 308].includes(status)
}

/**
 * Resolve a URL against a base URL (handles relative redirects)
 * @param {string} base - Base URL
 * @param {string} location - Location header value (may be relative)
 * @returns {string} Resolved absolute URL
 */
function resolveUrl(base, location) {
  // If location is already absolute, return it
  if (location.startsWith('http://') || location.startsWith('https://')) {
    return location
  }
  
  // Parse base URL
  const url = new URL(base)
  
  // Handle protocol-relative URLs
  if (location.startsWith('//')) {
    return url.protocol + location
  }
  
  // Handle absolute path
  if (location.startsWith('/')) {
    return url.protocol + '//' + url.host + location
  }
  
  // Handle relative path
  const basePath = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1)
  return url.protocol + '//' + url.host + basePath + location
}

/**
 * Validate a single URL without following redirects
 * @param {string} url - The URL to validate
 * @param {Function} fetch - The fetch function to use
 * @param {Object} options - Validation options
 * @returns {Object} Single validation result
 */
async function validateSingleUrl(url, fetch, options = {}) {
  const { timeout = 10000 } = options
  const startTime = Date.now()
  
  try {
    // Try HEAD request first (more efficient)
    let response = await fetch(url, {
      method: 'HEAD',
      timeout,
      redirect: 'manual' // Don't auto-follow redirects
    })
    
    // If HEAD is not supported, fallback to GET
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        timeout,
        redirect: 'manual'
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
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    return {
      url,
      status: null,
      statusText: error.message,
      duration,
      valid: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Create an error result object
 * @param {string} url - Original URL
 * @param {string} error - Error message
 * @param {Array} redirectChain - Chain of redirects encountered
 * @returns {Object} Error result object
 */
function createErrorResult(url, error, redirectChain = []) {
  return {
    url,
    valid: false,
    status: redirectChain.length > 0 ? redirectChain[0].status : null,
    error,
    redirectChain,
    redirectCount: redirectChain.length,
    timestamp: new Date().toISOString()
  }
}

/**
 * Enhanced URL validation that follows redirects
 * @param {string} url - The URL to validate
 * @param {Function} fetch - The fetch function to use
 * @param {Object} options - Validation options
 * @returns {Object} Enhanced validation result with redirect chain
 */
async function validateUrlWithRedirects(url, fetch, options = {}) {
  const { 
    maxRedirects = 5, 
    redirectTimeout = 10000,
    followRedirects = true,
    redirectHandling = 'remove' // 'remove', 'replace', or 'keep'
  } = options
  
  // If not following redirects, use simple validation
  if (!followRedirects) {
    const result = await validateSingleUrl(url, fetch, { timeout: redirectTimeout })
    return {
      ...result,
      finalUrl: url,
      finalStatus: result.status,
      redirectCount: 0,
      shouldIncludeInSitemap: result.valid,
      replacementUrl: null
    }
  }
  
  const redirectChain = []
  const visitedUrls = new Set()
  let currentUrl = url
  let redirectCount = 0
  
  while (redirectCount <= maxRedirects) {
    // Check for circular redirect
    if (visitedUrls.has(currentUrl)) {
      return createErrorResult(url, `Circular redirect detected: ${currentUrl}`, redirectChain)
    }
    visitedUrls.add(currentUrl)
    
    // Validate current URL
    const result = await validateSingleUrl(currentUrl, fetch, { timeout: redirectTimeout })
    redirectChain.push(result)
    
    // If not a redirect, we've reached the final destination
    if (!isRedirect(result.status)) {
      const totalDuration = redirectChain.reduce((sum, r) => sum + r.duration, 0)
      const hasRedirects = redirectCount > 0
      
      // Determine sitemap inclusion based on redirect handling policy
      let shouldIncludeInSitemap = false
      let replacementUrl = null
      
      if (!hasRedirects) {
        // No redirects - include if valid (200 OK)
        shouldIncludeInSitemap = result.valid
      } else {
        // Has redirects - apply redirect handling policy
        switch (redirectHandling) {
          case 'remove':
            // Remove all redirects from sitemap
            shouldIncludeInSitemap = false
            break
          case 'replace':
            // Replace with final destination if it's valid
            if (result.valid) {
              shouldIncludeInSitemap = true
              replacementUrl = currentUrl
            }
            break
          case 'keep':
            // Keep redirects if final destination is valid (old behavior)
            shouldIncludeInSitemap = result.valid
            break
          default:
            shouldIncludeInSitemap = false
        }
      }
      
      return {
        url, // Original URL
        valid: result.valid, // Whether final destination is accessible
        status: redirectChain[0].status, // Original status
        finalUrl: currentUrl,
        finalStatus: result.status,
        finalStatusText: result.statusText,
        redirectChain,
        redirectCount,
        duration: totalDuration,
        timestamp: new Date().toISOString(),
        shouldIncludeInSitemap,
        replacementUrl,
        redirectType: hasRedirects ? (result.valid ? 'successful' : 'broken') : 'none',
        // Add specific error for redirect to 404
        error: !result.valid && redirectCount > 0 
          ? `Redirect chain leads to ${result.status || 'error'}: ${result.statusText}`
          : result.error
      }
    }
    
    // Check for redirect location
    if (!result.redirectLocation) {
      return createErrorResult(
        url, 
        `Redirect ${result.status} without Location header`, 
        redirectChain
      )
    }
    
    // Resolve the redirect URL
    currentUrl = resolveUrl(currentUrl, result.redirectLocation)
    redirectCount++
  }
  
  // Too many redirects
  return createErrorResult(url, `Too many redirects (>${maxRedirects})`, redirectChain)
}

/**
 * Enhanced validation of multiple URLs with redirect following and deduplication
 * @param {Array} urls - Array of URL strings or objects with url property
 * @param {Object} options - Validation options
 * @returns {Object} Enhanced validation results with deduplication
 */
async function validateUrlsEnhanced(urls, options = {}) {
  const {
    concurrency = 10,
    onProgress = () => {},
    stopOnError = false,
    followRedirects = true,
    maxRedirects = 5,
    redirectTimeout = 10000,
    redirectHandling = 'remove', // 'remove', 'replace', or 'keep'
    deduplicateReplacements = true
  } = options
  
  const fetch = (await import('node-fetch')).default
  const pLimit = (await import('p-limit')).default
  const limit = pLimit(concurrency)
  
  // Extract URL strings from objects if needed
  const urlStrings = urls.map(item => 
    typeof item === 'string' ? item : item.url
  )
  
  const totalUrls = urlStrings.length
  let processedCount = 0
  const results = []
  const errors = []
  const redirectStats = {
    totalRedirects: 0,
    successfulRedirects: 0,
    brokenRedirects: 0,
    circularRedirects: 0,
    tooManyRedirects: 0,
    redirectDepths: {},
    redirectsRemoved: 0,
    redirectsReplaced: 0,
    duplicatesFound: 0
  }
  
  console.log(`\n🔍 Validating ${totalUrls} URLs with redirect following...`)
  console.log(`   Concurrency: ${concurrency}`)
  console.log(`   Follow redirects: ${followRedirects}`)
  console.log(`   Max redirects: ${maxRedirects}`)
  console.log(`   Redirect handling: ${redirectHandling}`)
  console.log(`   Deduplicate replacements: ${deduplicateReplacements}`)
  
  const validationPromises = urlStrings.map((url, index) => 
    limit(async () => {
      const result = await validateUrlWithRedirects(url, fetch, {
        followRedirects,
        maxRedirects,
        redirectTimeout,
        redirectHandling
      })
      
      processedCount++
      results.push(result)
      
      // Update statistics
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
      
      // Report progress
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
        replacementUrl: result.replacementUrl
      })
      
      // Enhanced logging for redirects
      if (progress % 10 === 0 || !result.valid || result.redirectCount > 0) {
        const emoji = result.valid ? '✅' : '❌'
        const statusInfo = result.status ? `(${result.status})` : '(ERROR)'
        
        if (result.redirectCount > 0) {
          const redirectInfo = `[${result.redirectCount} redirect${result.redirectCount > 1 ? 's' : ''}]`
          const finalInfo = result.finalStatus ? `→ ${result.finalStatus}` : '→ ERROR'
          
          let action = ''
          if (result.replacementUrl) {
            action = ` → REPLACE with ${result.replacementUrl}`
          } else if (!result.shouldIncludeInSitemap) {
            action = ` → REMOVE from sitemap`
          }
          
          console.log(`  ${emoji} ${url} ${statusInfo} ${redirectInfo} ${finalInfo}${action}`)
        } else if (!result.valid) {
          console.log(`  ${emoji} ${url} ${statusInfo} - ${result.statusText || result.error}`)
        } else if (progress % 10 === 0) {
          console.log(`  Progress: ${progress}% (${processedCount}/${totalUrls})`)
        }
      }
      
      if (stopOnError && !result.valid) {
        throw new Error(`Validation failed for ${url}: ${result.error || result.statusText}`)
      }
      
      return result
    })
  )
  
  try {
    await Promise.all(validationPromises)
  } catch (error) {
    if (stopOnError) {
      console.error(`\n❌ Validation stopped due to error: ${error.message}`)
    }
  }
  
  // Handle deduplication for replacements
  if (deduplicateReplacements && redirectHandling === 'replace') {
    const finalUrlCounts = new Map()
    
    // Count occurrences of each final URL
    results.forEach(result => {
      if (result.replacementUrl) {
        finalUrlCounts.set(result.replacementUrl, (finalUrlCounts.get(result.replacementUrl) || 0) + 1)
      }
    })
    
    // Find duplicates and mark extras for removal
    const duplicateUrls = new Set()
    finalUrlCounts.forEach((count, url) => {
      if (count > 1) {
        duplicateUrls.add(url)
        redirectStats.duplicatesFound += count - 1
      }
    })
    
    // Remove duplicates (keep first occurrence)
    const seenReplacements = new Set()
    results.forEach(result => {
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
  
  const validCount = results.filter(r => r.valid).length
  const invalidCount = results.filter(r => !r.valid).length
  const sitemapIncludeCount = results.filter(r => r.shouldIncludeInSitemap).length
  
  console.log(`\n✅ Validation complete:`)
  console.log(`   Valid URLs: ${validCount}`)
  console.log(`   Invalid URLs: ${invalidCount}`)
  console.log(`   URLs for sitemap: ${sitemapIncludeCount}`)
  console.log(`   Success rate: ${((validCount / totalUrls) * 100).toFixed(1)}%`)
  console.log(`   Sitemap inclusion rate: ${((sitemapIncludeCount / totalUrls) * 100).toFixed(1)}%`)
  
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
      .sort(([a], [b]) => a - b)
      .forEach(([depth, count]) => {
        console.log(`     ${depth} redirect${depth > 1 ? 's' : ''}: ${count} URLs`)
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
        retrySuccessRate: redirectStats.retriedUrls > 0 
          ? redirectStats.retriedSuccesses / redirectStats.retriedUrls 
          : 0
      }
    }
  }
}

/**
 * Generate enhanced validation report with redirect analysis
 * @param {Object} validationResults - Results from validateUrlsEnhanced
 * @param {Object} options - Report options
 * @returns {Object} Enhanced report with redirect analysis
 */
function generateEnhancedValidationReport(validationResults, options = {}) {
  const { results, summary } = validationResults
  const { includeValid = false, includeRedirectChains = true } = options
  
  // Group results by status
  const byStatus = results.reduce((acc, result) => {
    const status = result.status || 'ERROR'
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(result)
    return acc
  }, {})
  
  // Group by final status (after redirects)
  const byFinalStatus = results.reduce((acc, result) => {
    const status = result.finalStatus || result.status || 'ERROR'
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(result)
    return acc
  }, {})
  
  // Extract redirect chains that lead to errors
  const problematicRedirects = results
    .filter(r => r.redirectCount > 0 && !r.valid)
    .map(r => ({
      url: r.url,
      chain: r.redirectChain.map(step => ({
        url: step.url,
        status: step.status,
        location: step.redirectLocation
      })),
      finalStatus: r.finalStatus,
      error: r.error
    }))
  
  // Calculate average response times
  const validResults = results.filter(r => r.valid)
  const avgResponseTime = validResults.length > 0
    ? validResults.reduce((sum, r) => sum + r.duration, 0) / validResults.length
    : 0
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      ...summary,
      avgResponseTime: Math.round(avgResponseTime)
    },
    byStatus,
    byFinalStatus,
    invalidUrls: summary.errors.map(e => ({
      url: e.url,
      status: e.status,
      finalStatus: e.finalStatus,
      message: e.error || e.statusText,
      duration: e.duration,
      redirectCount: e.redirectCount
    })),
    problematicRedirects
  }
  
  if (includeValid) {
    report.validUrls = results
      .filter(r => r.valid)
      .map(r => ({
        url: r.url,
        status: r.status,
        finalStatus: r.finalStatus,
        duration: r.duration,
        redirectCount: r.redirectCount
      }))
  }
  
  if (includeRedirectChains) {
    report.allRedirectChains = results
      .filter(r => r.redirectCount > 0)
      .map(r => ({
        url: r.url,
        valid: r.valid,
        chain: r.redirectChain.map(step => ({
          url: step.url,
          status: step.status,
          location: step.redirectLocation
        }))
      }))
  }
  
  return report
}

/**
 * Process URL validation results for sitemap generation
 * @param {Object} validationResults - Results from validateUrlsEnhanced
 * @param {Array} originalUrls - Original URL objects from sitemap generation
 * @returns {Object} Processed URLs for sitemap inclusion
 */
function processUrlsForSitemap(validationResults, originalUrls) {
  const { results } = validationResults
  const processedUrls = []
  const removedUrls = []
  const replacedUrls = []
  
  // Create a map of original URLs for reference
  const originalUrlMap = new Map()
  originalUrls.forEach(urlObj => {
    const url = typeof urlObj === 'string' ? urlObj : urlObj.url
    originalUrlMap.set(url, urlObj)
  })
  
  results.forEach(result => {
    const originalUrlObj = originalUrlMap.get(result.url)
    
    if (result.shouldIncludeInSitemap) {
      if (result.replacementUrl) {
        // Replace with final destination
        const replacedUrlObj = typeof originalUrlObj === 'string' 
          ? result.replacementUrl
          : { ...originalUrlObj, url: result.replacementUrl }
        
        processedUrls.push(replacedUrlObj)
        replacedUrls.push({
          original: result.url,
          replacement: result.replacementUrl,
          redirectCount: result.redirectCount
        })
      } else {
        // Keep original URL
        processedUrls.push(originalUrlObj)
      }
    } else {
      // Remove from sitemap
      removedUrls.push({
        url: result.url,
        reason: result.error || `${result.redirectType} redirect`,
        redirectCount: result.redirectCount,
        finalStatus: result.finalStatus
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
      replacedCount: replacedUrls.length
    }
  }
}

// Export enhanced functions alongside original ones for backward compatibility
module.exports = {
  // Original functions
  validateUrl: validateSingleUrl,
  
  // Enhanced functions
  validateUrlWithRedirects,
  validateUrlsEnhanced,
  generateEnhancedValidationReport,
  processUrlsForSitemap,
  
  // Utility functions
  isRedirect,
  resolveUrl,
  
  // For backward compatibility, export enhanced versions as the main functions
  validateUrls: validateUrlsEnhanced,
  generateValidationReport: generateEnhancedValidationReport,
  
  // Enhanced filter function that handles redirects
  filterValidUrls: function(urlObjects, validationResults) {
    // Handle both calling patterns:
    // 1. New: filterValidUrls(urlObjects, fullValidationResults)
    // 2. Legacy: filterValidUrls(urlObjects, validationResults.results)
    
    if (Array.isArray(validationResults)) {
      // Legacy pattern: validationResults is actually the results array
      const validUrlSet = new Set(
        validationResults
          .filter(r => r.valid)
          .map(r => r.url)
      )
      
      return urlObjects.filter(urlObj => 
        validUrlSet.has(typeof urlObj === 'string' ? urlObj : urlObj.url)
      )
    } else {
      // New pattern: validationResults is the full object
      const { processedUrls } = processUrlsForSitemap(validationResults, urlObjects)
      return processedUrls
    }
  }
} 