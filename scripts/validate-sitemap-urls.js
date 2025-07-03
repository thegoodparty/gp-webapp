/**
 * URL validation utilities for sitemap generation
 */

/**
 * Validate a single URL using HEAD request with GET fallback
 * @param {string} url - The URL to validate
 * @param {Function} fetch - The fetch function to use
 * @returns {Object} Validation result object
 */
async function validateUrl(url, fetch) {
  const startTime = Date.now()
  
  try {
    // Try HEAD request first (more efficient)
    let response = await fetch(url, {
      method: 'HEAD',
      timeout: 10000, // 10 second timeout
      redirect: 'manual' // Don't auto-follow redirects
    })
    
    // If HEAD is not supported, fallback to GET
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        timeout: 10000,
        redirect: 'manual'
      })
    }
    
    const duration = Date.now() - startTime
    
    // Consider these status codes as valid
    const validStatuses = [
      200, // OK
      301, // Moved Permanently
      302, // Found (Temporary Redirect)
      303, // See Other
      307, // Temporary Redirect
      308, // Permanent Redirect
    ]
    
    const isValid = validStatuses.includes(response.status)
    
    return {
      url,
      valid: isValid,
      status: response.status,
      statusText: response.statusText,
      duration,
      timestamp: new Date().toISOString(),
      redirectLocation: response.headers.get('location')
    }
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    return {
      url,
      valid: false,
      status: null,
      statusText: error.message,
      duration,
      timestamp: new Date().toISOString(),
      error: error.message
    }
  }
}

/**
 * Validate multiple URLs with concurrency control
 * @param {Array} urls - Array of URL strings or objects with url property
 * @param {Object} options - Validation options
 * @param {number} options.concurrency - Max concurrent requests (default: 10)
 * @param {Function} options.onProgress - Progress callback function
 * @param {boolean} options.stopOnError - Stop validation on first error (default: false)
 * @returns {Object} Validation results
 */
async function validateUrls(urls, options = {}) {
  const {
    concurrency = 10,
    onProgress = () => {},
    stopOnError = false
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
  
  console.log(`\n🔍 Validating ${totalUrls} URLs with concurrency limit of ${concurrency}...`)
  
  const validationPromises = urlStrings.map((url, index) => 
    limit(async () => {
      const result = await validateUrl(url, fetch)
      processedCount++
      
      if (!result.valid) {
        errors.push(result)
      }
      
      results.push(result)
      
      // Report progress
      const progress = Math.round((processedCount / totalUrls) * 100)
      onProgress({
        current: processedCount,
        total: totalUrls,
        progress,
        url,
        valid: result.valid,
        status: result.status
      })
      
      // Log progress every 10% or for errors
      if (progress % 10 === 0 || !result.valid) {
        const emoji = result.valid ? '✅' : '❌'
        const statusInfo = result.status ? `(${result.status})` : '(ERROR)'
        
        if (!result.valid) {
          console.log(`  ${emoji} ${url} ${statusInfo} - ${result.statusText}`)
        } else if (progress % 10 === 0) {
          console.log(`  Progress: ${progress}% (${processedCount}/${totalUrls})`)
        }
      }
      
      if (stopOnError && !result.valid) {
        throw new Error(`Validation failed for ${url}: ${result.statusText}`)
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
  
  const validCount = results.filter(r => r.valid).length
  const invalidCount = results.filter(r => !r.valid).length
  
  console.log(`\n✅ Validation complete:`)
  console.log(`   Valid URLs: ${validCount}`)
  console.log(`   Invalid URLs: ${invalidCount}`)
  console.log(`   Success rate: ${((validCount / totalUrls) * 100).toFixed(1)}%`)
  
  return {
    results,
    summary: {
      total: totalUrls,
      valid: validCount,
      invalid: invalidCount,
      successRate: validCount / totalUrls,
      errors
    }
  }
}

/**
 * Generate validation report
 * @param {Object} validationResults - Results from validateUrls
 * @param {Object} options - Report options
 * @returns {Object} Formatted report
 */
function generateValidationReport(validationResults, options = {}) {
  const { results, summary } = validationResults
  const { includeValid = false } = options
  
  // Group results by status
  const byStatus = results.reduce((acc, result) => {
    const status = result.status || 'ERROR'
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(result)
    return acc
  }, {})
  
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
    invalidUrls: summary.errors.map(e => ({
      url: e.url,
      status: e.status,
      message: e.statusText,
      duration: e.duration
    }))
  }
  
  if (includeValid) {
    report.validUrls = results
      .filter(r => r.valid)
      .map(r => ({
        url: r.url,
        status: r.status,
        duration: r.duration
      }))
  }
  
  return report
}

/**
 * Filter URL objects to remove invalid URLs
 * @param {Array} urlObjects - Array of URL objects from sitemap generation
 * @param {Array} validationResults - Validation results
 * @returns {Array} Filtered array of valid URL objects
 */
function filterValidUrls(urlObjects, validationResults) {
  const validUrlSet = new Set(
    validationResults
      .filter(r => r.valid)
      .map(r => r.url)
  )
  
  return urlObjects.filter(urlObj => 
    validUrlSet.has(typeof urlObj === 'string' ? urlObj : urlObj.url)
  )
}

module.exports = {
  validateUrl,
  validateUrls,
  generateValidationReport,
  filterValidUrls
} 