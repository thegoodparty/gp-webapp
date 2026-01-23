# Sitemap Scripts Documentation

This directory contains scripts for generating, validating, and maintaining static XML sitemaps for the GoodParty.org web application.

## Overview

The sitemap system has evolved from dynamic on-demand generation to a static build-time process that creates XML files, validates URLs, and serves them efficiently. This approach dramatically reduces server load while improving SEO performance.

## Scripts

### 📝 `generate-sitemaps.ts`

**Purpose**: Main sitemap generation script that creates all XML sitemap files at build time.

**What it does**:
- Generates main sitemap with static pages, blog articles, FAQs, and glossary terms
- Creates state-specific sitemaps with places and races data (51 states)
- Creates candidate sitemaps with candidate profile data (where available)
- Handles automatic sitemap splitting when URL count/size limits are exceeded
- Generates sitemap index file listing all sitemaps
- Optionally validates URLs during generation (skips main sitemap's static URLs for efficiency)
- Creates timestamped generation reports

**Usage**:
```bash
# Generate all sitemaps (production URLs by default)
npx tsx scripts/generate-sitemaps.ts

# Generate main sitemap only (fast - useful for testing)
npx tsx scripts/generate-sitemaps.ts --main-only

# Generate sitemaps with URL validation (validates dynamic URLs only - skips static main sitemap)
npx tsx scripts/generate-sitemaps.ts --validate

# Generate with enhanced redirect handling (removes all redirects for better SEO)
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling remove

# Generate main sitemap only with validation (fastest validation option)
npx tsx scripts/generate-sitemaps.ts --main-only --validate
```

**Output**:
- `public/sitemap.xml` - Main sitemap index (root entry point)
- `public/sitemaps/sitemap.xml` - Main sitemap with core pages  
- `public/sitemaps/state/{state}/sitemap/{index}.xml` - State-specific sitemaps
- `public/sitemaps/candidates/{state}/sitemap/{index}.xml` - Candidate sitemaps
- `public/sitemaps/generation-report-{timestamp}.json` - Generation report
- `public/sitemaps/validation-report-{timestamp}.json` - Validation report (if --validate used)

---

### 🔍 `validate-sitemap-urls.ts`

**Purpose**: Enhanced URL validation that follows redirects and provides multiple strategies for handling them in sitemaps according to SEO best practices.

**What it does**:
- Makes HEAD requests to validate each URL (with GET fallback for 405/501 responses)
- Follows redirect chains up to a configurable depth (default: 5)
- Validates the final destination URL after following redirects
- Detects circular redirects and redirect loops
- Includes automatic retry logic for transient network errors
- Controls concurrency to avoid overwhelming servers
- Tracks response times and status codes
- Generates detailed validation reports with redirect analysis
- Provides progress reporting during validation

**Features**:
- **Concurrency Control**: Limits parallel requests (default: 20)
- **Intelligent Requests**: Uses HEAD first, falls back to GET when needed
- **Redirect Following**: Validates the entire redirect chain
- **Transient Error Retry**: Automatically retries ECONNECT, ETIMEDOUT, and other network errors
- **Circular Detection**: Identifies redirect loops
- **Chain Analysis**: Shows full path from original URL to final destination
- **Smart Validation**: Marks URLs as invalid if redirect destination is inaccessible
- **Deduplication**: Prevents multiple redirects pointing to the same final URL
- **Flexible Handling**: Choose how to handle redirects based on your SEO strategy
- **Performance Tracking**: Records response times for each URL
- **Error Categorization**: Groups errors by status code
- **Progress Reporting**: Shows validation progress in 10% increments

**Used by**: `generate-sitemaps.ts` when `--validate` flag is provided

---

**Redirect Handling Strategies**:

The validation supports three different approaches for managing redirects in sitemaps:



1. **`remove` (Recommended for SEO)**:
   ```bash
   # Remove all redirects from sitemap
   npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling remove
   ```
   - Removes all URLs that redirect (even successful ones)
   - Cleanest sitemap with only direct 200 OK responses
   - Best for SEO as search engines prefer canonical URLs

2. **`replace` (Alternative SEO approach)**:
   ```bash
   # Replace redirects with their final destinations
   npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling replace
   ```
   - Replaces redirect URLs with their final destinations
   - Includes deduplication to prevent multiple URLs pointing to same page
   - Good for preserving URL coverage while maintaining SEO quality

3. **`keep` (Legacy behavior)**:
   ```bash
   # Keep redirects if they lead to valid destinations
   npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling keep
   ```
   - Keeps redirects in sitemap if final destination is accessible
   - Only removes redirects that lead to 404s
   - Maintains backward compatibility

**Usage Examples**:
```bash
# Recommended: Remove all redirects (cleanest for SEO)
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling remove

# Alternative: Replace redirects with destinations
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling replace

# Legacy: Keep successful redirects
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling keep

# Validate with custom redirect depth
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling remove --max-redirects 10

# Disable redirect following (fastest)
npx tsx scripts/generate-sitemaps.ts --validate --no-follow-redirects
```

**Example Redirect Validation Results**:
```
# With redirect-handling=remove
/old-page → 301 → /new-page → 200
Result: URL removed from sitemap (redirect)

# With redirect-handling=replace  
/old-page → 301 → /new-page → 200
Result: URL replaced with /new-page in sitemap

# With redirect-handling=keep
/old-page → 301 → /new-page → 200
Result: URL kept in sitemap (valid destination)

# All strategies handle broken redirects the same way
/broken → 301 → /missing → 404
Result: URL removed from sitemap (broken redirect)

# Circular redirects are always removed
/page-a → 301 → /page-b → 301 → /page-a
Result: URL removed from sitemap (circular redirect)
```

**Enhanced Report Output**:
The validation report now includes:
- `redirectStats`: Detailed statistics about redirect patterns
  - `successfulRedirects`: Redirects that lead to 200 OK
  - `brokenRedirects`: Redirects that lead to 404s or errors
  - `redirectsRemoved`: Count of redirects removed from sitemap
  - `redirectsReplaced`: Count of redirects replaced with destinations
  - `duplicatesFound`: Count of duplicate final destinations prevented
- `problematicRedirects`: Array of redirects leading to errors
- `byFinalStatus`: URLs grouped by their final status after redirects
- `allRedirectChains`: Complete redirect paths for analysis

**Deduplication Logic**:
When using `replace` mode, the system automatically handles deduplication:
```
/old-url-1 → 301 → /final-page → 200
/old-url-2 → 301 → /final-page → 200
/old-url-3 → 301 → /final-page → 200

Result: Only one /final-page entry in sitemap
Actions: 
- /old-url-1 → replaced with /final-page
- /old-url-2 → removed (duplicate)
- /old-url-3 → removed (duplicate)
```

**Performance Impact**:
- `remove` mode: Fastest (no deduplication needed)
- `replace` mode: Moderate (includes deduplication processing)
- `keep` mode: Fastest (legacy behavior)

**SEO Recommendation**:
Use `remove` mode for optimal SEO performance. This ensures your sitemap only contains direct, canonical URLs that return 200 OK responses, which is exactly what search engines prefer.

---

### 🧹 `prune-invalid-urls.ts`

**Purpose**: Removes invalid URLs from existing sitemaps using validation reports (much faster than re-validation).

**What it does**:
- Reads existing validation reports to identify invalid URLs
- Parses XML sitemap files to extract current URLs
- Filters out invalid URLs (404s, timeouts, network errors)
- Regenerates clean XML files with only valid URLs
- Updates sitemap index to reflect changes
- Creates detailed pruning reports

**Usage**:
```bash
# Preview what would be removed (safe dry-run)
npx tsx scripts/prune-invalid-urls.ts --dry-run

# Remove invalid URLs using most recent validation report
npx tsx scripts/prune-invalid-urls.ts

# Use specific validation report
npx tsx scripts/prune-invalid-urls.ts --report path/to/validation-report.json

# Dry run with specific report
npx tsx scripts/prune-invalid-urls.ts --report path/to/report.json --dry-run
```

**Key Benefits**:
- **Lightning Fast**: ~0.6 seconds vs ~7 minutes for full validation
- **Reuse Work**: Leverages existing validation reports
- **Safe**: Dry-run mode to preview changes
- **Quality**: Dramatically improves sitemap quality (removes 404s)

**Output**:
- Updates existing sitemap XML files (removes invalid URLs)
- Regenerates main sitemap index (`public/sitemap.xml`)
- Creates `public/sitemaps/pruning-report-{timestamp}.json`

---

### 📊 `generate-invalid-urls-csv.ts`

**Purpose**: Converts validation report JSON to CSV format for easier analysis of invalid URLs and redirects.

**What it does**:
- Reads validation report JSON files
- Extracts both invalid URLs (404s, timeouts, etc.) and redirect URLs
- Exports data to CSV format for spreadsheet analysis
- Provides detailed information about URL status, response times, and redirect chains

**Usage**:
```bash
# Generate CSV from validation report
npx tsx scripts/generate-invalid-urls-csv.ts public/sitemaps/validation-report-2025-07-08T00-47-10.json

# Specify custom output filename
npx tsx scripts/generate-invalid-urls-csv.ts validation-report.json custom-output.csv
```

**CSV Output Format**:
```csv
URL,Status,Duration,Final URL,Final Status,Redirect Type
https://example.com/404,404,100,,,
https://example.com/redirect,308,200,https://example.com/,200,successful
```

**Key Benefits**:
- **Spreadsheet Analysis**: Easy to filter, sort, and analyze in Excel/Google Sheets
- **Team Collaboration**: Share CSV files with non-technical team members
- **Pattern Recognition**: Identify common redirect patterns and broken URL types
- **SEO Optimization**: Analyze redirect chains for SEO compliance
- **Reporting**: Generate reports for stakeholders on sitemap quality

**Use Cases**:
- Analyze redirect patterns to improve SEO strategy
- Identify broken URL patterns for content team fixes
- Generate reports for stakeholders on sitemap health
- Plan content migration and URL structure improvements
- Track sitemap quality improvements over time

This CSV format allows your team to easily analyze both invalid URLs and redirects, aiding in sitemap optimization and SEO compliance.

---

## Library Files (`lib/`)

### `xml.ts`
- **`convertToXML(urls)`**: Converts URL objects to XML sitemap format
- **`generateRootIndex(sitemaps)`**: Creates sitemap index XML
- **Character escaping**: Handles XML special characters (&, <, >, ", ')

### `sitemap-helpers.ts`
- **`writeSplitSitemaps()`**: Handles large sitemaps that exceed size/URL limits
- **`needsSplitting()`**: Checks if sitemap should be split
- **`ensureDirectoryExists()`**: Creates directories as needed
- **`writeSitemapXML()`**: Writes XML content to files

## Direct Script Execution

All scripts are TypeScript files and can be run with `npx tsx`:

```bash
# Main generation script
npx tsx scripts/generate-sitemaps.ts

# URL validation (standalone)
npx tsx scripts/validate-sitemap-urls.ts

# Invalid URL pruning
npx tsx scripts/prune-invalid-urls.ts

# Clean sitemaps directory
rm -rf public/sitemaps
```

## Recommended Workflow

### 🚀 **Initial Setup / Full Regeneration**
```bash
# Clean any existing sitemaps
rm -rf public/sitemaps

# Generate fresh sitemaps with validation (removes redirects for better SEO)
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling remove

# This creates both sitemaps AND validation report
```

### ⚡ **Regular Maintenance**
```bash
# Quick regeneration (main sitemap only - great for testing content changes)
npx tsx scripts/generate-sitemaps.ts --main-only

# Full regeneration (when content changes)
npx tsx scripts/generate-sitemaps.ts

# Clean up invalid URLs using existing validation report
npx tsx scripts/prune-invalid-urls.ts
```

### 🔍 **Quality Assurance**
```bash
# Preview what URLs would be removed
npx tsx scripts/prune-invalid-urls.ts --dry-run

# Check recent validation report
cat public/sitemaps/validation-report-*.json | jq '.summary'

# Check generation statistics
cat public/sitemaps/generation-report-*.json | jq '.urls'
```

## Environment Variables

The scripts use the following environment variables (all default to production values):

- `NEXT_PUBLIC_APP_BASE`: Base URL for the application (default: https://goodparty.org)
- `NEXT_PUBLIC_API_BASE`: GP API base URL (default: https://gp-api.goodparty.org)
- `NEXT_PUBLIC_ELECTION_API_BASE`: Election API base URL (default: https://election-api.goodparty.org)
- `NODE_ENV`: Environment for reporting (default: production)

**Note**: No `.env` file is required. All environment variables have production defaults and work out-of-the-box. Override only if you need to point to different API endpoints for testing.

## Output Files

All generated files are saved to `public/sitemaps/` and include timestamps to avoid conflicts:

### 📋 **Sitemap Files**
- `sitemap.xml` - Root sitemap linking to main, state-specific, and candidate sitemaps
- `sitemaps/sitemap.xml` - Main sitemap with core pages
- `sitemaps/state/{state}/sitemap/{index}.xml` - State-specific sitemaps
- `sitemaps/candidates/{state}/sitemap/{index}.xml` - Candidate sitemaps

**Note**: The main sitemap index is served from the root as `public/sitemap.xml`

### 📊 **Report Files**
- `generation-report-{timestamp}.json` - Generation statistics and metadata
- `validation-report-{timestamp}.json` - URL validation results (when validation run)
- `pruning-report-{timestamp}.json` - URL pruning results (when pruning run)

## Performance & Quality Metrics

### **Generation Performance**
- **Time**: ~30-50 seconds for full generation
- **Output**: 69+ sitemaps with 190,000+ URLs
- **Size**: Individual sitemaps stay under 50MB limit

### **Validation Performance**  
- **Full validation**: ~6 minutes for 195K URLs (skips main sitemap's static URLs)
- **Main sitemap only**: Skipped automatically (static URLs don't need validation)
- **Concurrency**: 20 parallel requests
- **Success Rate**: ~94% valid URLs (higher with retry logic)
- **Average Response**: ~150ms per URL
- **Retry Success**: Automatically recovers from ~60% of transient network errors

### **Pruning Performance**
- **Time**: ~0.6 seconds for 71 files  
- **Efficiency**: 700x faster than re-validation
- **Quality Gain**: Removes 15,000+ invalid URLs
- **Success Rate**: Nearly 100% after pruning

## Error Handling

The scripts include comprehensive error handling:

- **Network Errors**: Gracefully handled with retry logic
- **API Timeouts**: Logged but don't stop generation
- **Invalid Data**: Filtered out with warnings
- **File System**: Ensures directories exist before writing
- **Memory**: Efficient streaming for large datasets

## Integration

### **Build Process**
Add sitemap generation to your build process:
```bash
# In your CI/CD pipeline (production URLs by default)
npx tsx scripts/generate-sitemaps.ts

# With validation for quality assurance
npx tsx scripts/generate-sitemaps.ts --validate --redirect-handling remove

# Quick build for testing (main sitemap only)
npx tsx scripts/generate-sitemaps.ts --main-only
```

### **Deployment**
Static files in `public/sitemaps/` are automatically served by Next.js with proper caching headers.

### **Monitoring**
Check generation and validation reports to monitor:
- URL count trends
- Invalid URL patterns  
- Generation performance
- API response times

## Troubleshooting

### **Common Issues**

**Generation fails with API errors**:
- Check environment variables
- Verify API endpoints are accessible
- Check network connectivity

**Validation takes too long**:
- Use `--main-only` flag for faster testing (6 seconds vs 7 minutes)
- Use pruning instead of re-validation when possible
- Adjust concurrency limit if overwhelming servers
- Consider validating subsets of URLs

**Network connection errors during validation**:
- Automatic retry logic handles most transient errors (ECONNECT, ETIMEDOUT)
- Check retry statistics in validation reports for success rates
- Reduce concurrency if network is unstable

**Out of memory errors**:
- Large sitemaps are automatically split
- Ensure sufficient system memory
- Consider running in production environment

### **Debug Commands**

```bash
# Check what sitemaps were generated
ls -la public/sitemaps/

# Validate XML structure
xmllint --noout public/sitemaps/sitemap.xml

# Check recent generation stats
jq '.sitemaps' public/sitemaps/generation-report-*.json

# Find validation issues
jq '.summary' public/sitemaps/validation-report-*.json
```

## Migration from Dynamic System

The static system replaces the previous dynamic sitemap generation (`app/sitemaps/`). Key improvements:

- **Performance**: No server-side generation overhead
- **Caching**: Static files with optimal cache headers  
- **Quality**: Enhanced URL validation with redirect following and automatic retry
- **SEO Optimization**: Configurable redirect handling (remove/replace/keep strategies)
- **Reliability**: Transient error recovery with retry logic
- **Scalability**: Handles 200K+ URLs efficiently
- **Maintenance**: Easy cleanup of invalid URLs
- **Flexibility**: Main-only mode for rapid development and testing

The dynamic routes have been disabled (renamed to `.disabled`) to prevent conflicts with static files.
