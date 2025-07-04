#!/usr/bin/env node

/**
 * Test script to demonstrate enhanced redirect validation
 * This shows how the new validation handles various redirect scenarios
 */

const { validateUrlWithRedirects } = require('./validate-sitemap-urls-enhanced')

// Test URLs with various redirect patterns
const testUrls = [
  // Direct 200 response
  { url: 'https://goodparty.org/', expected: 'Direct 200 OK' },
  
  // Common redirect patterns (these are examples - actual URLs may differ)
  { url: 'https://goodparty.org/candidate/jared-alper', expected: 'Might redirect or 404' },
  { url: 'https://goodparty.org/candidates/', expected: 'Might redirect to state page' },
  
  // Known problematic patterns (hypothetical examples)
  { url: 'https://goodparty.org/old-blog-post', expected: 'Likely 301 → 404' },
  { url: 'https://goodparty.org/legacy-page', expected: 'Possible redirect chain' },
]

async function testRedirectValidation() {
  console.log('🔍 Testing Enhanced Redirect Validation\n')
  console.log('This demonstrates how the enhanced validation follows redirects')
  console.log('and identifies URLs that ultimately lead to errors.\n')
  
  const fetch = (await import('node-fetch')).default
  
  for (const test of testUrls) {
    console.log(`\nTesting: ${test.url}`)
    console.log(`Expected: ${test.expected}`)
    
    try {
      const result = await validateUrlWithRedirects(test.url, fetch, {
        followRedirects: true,
        maxRedirects: 5,
        redirectTimeout: 10000
      })
      
      // Display results
      console.log(`Status: ${result.valid ? '✅ Valid' : '❌ Invalid'}`)
      console.log(`Original Status: ${result.status || 'ERROR'}`)
      
      if (result.redirectCount > 0) {
        console.log(`Redirect Count: ${result.redirectCount}`)
        console.log(`Final URL: ${result.finalUrl}`)
        console.log(`Final Status: ${result.finalStatus || 'ERROR'}`)
        
        // Show redirect chain
        console.log('Redirect Chain:')
        result.redirectChain.forEach((step, index) => {
          const arrow = index < result.redirectChain.length - 1 ? '→' : '✓'
          console.log(`  ${step.url} [${step.status}] ${arrow}`)
          if (step.redirectLocation && index < result.redirectChain.length - 1) {
            console.log(`    ↓ ${step.redirectLocation}`)
          }
        })
      }
      
      if (result.error) {
        console.log(`Error: ${result.error}`)
      }
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`)
    }
  }
  
  console.log('\n\n📊 Summary:')
  console.log('The enhanced validation provides much better insight into redirect chains')
  console.log('and can identify URLs that eventually lead to 404s or other errors.')
  console.log('\nThis helps maintain higher quality sitemaps by removing URLs that')
  console.log('search engines would encounter errors when crawling.')
}

// Run test if executed directly
if (require.main === module) {
  console.log('Note: This is a demonstration script. Actual results depend on')
  console.log('the current state of the website and its redirects.\n')
  
  testRedirectValidation()
    .then(() => {
      console.log('\n✅ Test completed')
    })
    .catch(error => {
      console.error('\n❌ Test error:', error.message)
      process.exit(1)
    })
}

module.exports = { testRedirectValidation } 