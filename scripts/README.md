# Sitemap Scripts Documentation

This directory contains scripts for generating, validating, and maintaining static XML sitemaps for the GoodParty.org web application.

## Overview

The sitemap system has evolved from dynamic on-demand generation to a static build-time process that creates XML files, validates URLs, and serves them efficiently. This approach dramatically reduces server load while improving SEO performance.

## Scripts

### 📝 `generate-sitemaps.js`

**Purpose**: Main sitemap generation script that creates all XML sitemap files at build time.

**What it does**:
- Generates main sitemap with static pages, blog articles, FAQs, and glossary terms
- Creates state-specific sitemaps with places and races data (51 states)
- Creates candidate sitemaps with candidate profile data (where available)
- Handles automatic sitemap splitting when URL count/size limits are exceeded
- Generates sitemap index file listing all sitemaps
- Optionally validates URLs during generation
- Creates timestamped generation reports

**Usage**:
```bash
# Generate sitemaps for production
npm run build:sitemaps

# Generate sitemaps for development environment
npm run build:sitemaps:dev

# Generate sitemaps with URL validation (slower)
npm run build:sitemaps:dev -- --validate
```

**Output**:
- `public/sitemaps/sitemap.xml` - Main sitemap with core pages
- `public/sitemaps/sitemap-index.xml` - Index of all sitemaps
- `public/sitemaps/state/{state}/sitemap/{index}.xml` - State-specific sitemaps
- `public/sitemaps/candidates/{state}/sitemap/{index}.xml` - Candidate sitemaps
- `public/sitemaps/generation-report-{timestamp}.json` - Generation report
- `public/sitemaps/validation-report-{timestamp}.json` - Validation report (if --validate used)

---

### 🔍 `validate-sitemap-urls.js`

**Purpose**: Validates URLs in sitemaps by making HTTP requests to check their availability.

**What it does**:
- Makes HEAD requests to validate each URL (with GET fallback for 405/501 responses)
- Handles redirects (301/302) as valid
- Controls concurrency to avoid overwhelming servers
- Tracks response times and status codes
- Generates detailed validation reports
- Provides progress reporting during validation

**Features**:
- **Concurrency Control**: Limits parallel requests (default: 20)
- **Intelligent Requests**: Uses HEAD first, falls back to GET when needed
- **Redirect Handling**: Treats 301/302 redirects as valid
- **Performance Tracking**: Records response times for each URL
- **Error Categorization**: Groups errors by status code
- **Progress Reporting**: Shows validation progress in 10% increments

**Used by**: `generate-sitemaps.js` when `--validate` flag is provided

---

### 🧹 `prune-invalid-urls.js`

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
npm run prune-invalid-urls:dry-run

# Remove invalid URLs using most recent validation report
npm run prune-invalid-urls

# Use specific validation report
node scripts/prune-invalid-urls.js --report path/to/validation-report.json

# Dry run with specific report
node scripts/prune-invalid-urls.js --report path/to/report.json --dry-run
```

**Key Benefits**:
- **Lightning Fast**: ~0.6 seconds vs ~7 minutes for full validation
- **Reuse Work**: Leverages existing validation reports
- **Safe**: Dry-run mode to preview changes
- **Quality**: Dramatically improves sitemap quality (removes 404s)

**Output**:
- Updates existing sitemap XML files (removes invalid URLs)
- Regenerates `sitemap-index.xml`
- Creates `public/sitemaps/pruning-report-{timestamp}.json`

---

## Library Files (`lib/`)

### `xml.js`
- **`convertToXML(urls)`**: Converts URL objects to XML sitemap format
- **`generateRootIndex(sitemaps)`**: Creates sitemap index XML
- **Character escaping**: Handles XML special characters (&, <, >, ", ')

### `sitemap-helpers.js`
- **`writeSplitSitemaps()`**: Handles large sitemaps that exceed size/URL limits
- **`needsSplitting()`**: Checks if sitemap should be split
- **`ensureDirectoryExists()`**: Creates directories as needed
- **`writeSitemapXML()`**: Writes XML content to files

## NPM Scripts

The following npm scripts are available for easy use:

```json
{
  "build:sitemaps": "node scripts/generate-sitemaps.js",
  "build:sitemaps:dev": "cross-env NODE_ENV=development node scripts/generate-sitemaps.js", 
  "clean:sitemaps": "rm -rf public/sitemaps",
  "prune-invalid-urls": "node scripts/prune-invalid-urls.js",
  "prune-invalid-urls:dry-run": "node scripts/prune-invalid-urls.js --dry-run"
}
```

## Recommended Workflow

### 🚀 **Initial Setup / Full Regeneration**
```bash
# Clean any existing sitemaps
npm run clean:sitemaps

# Generate fresh sitemaps with validation
npm run build:sitemaps:dev -- --validate

# This creates both sitemaps AND validation report
```

### ⚡ **Regular Maintenance**
```bash
# Regenerate sitemaps (when content changes)
npm run build:sitemaps:dev

# Clean up invalid URLs using existing validation report
npm run prune-invalid-urls
```

### 🔍 **Quality Assurance**
```bash
# Preview what URLs would be removed
npm run prune-invalid-urls:dry-run

# Check recent validation report
cat public/sitemaps/validation-report-*.json | jq '.summary'

# Check generation statistics
cat public/sitemaps/generation-report-*.json | jq '.urls'
```

## Environment Variables

The scripts use the following environment variables:

- `NEXT_PUBLIC_APP_BASE`: Base URL for the application (default: https://goodparty.org)
- `NEXT_PUBLIC_API_BASE`: GP API base URL (default: https://gp-api-dev.goodparty.org)
- `NEXT_PUBLIC_ELECTION_API_BASE`: Election API base URL (default: https://election-api-dev.goodparty.org)
- `NODE_ENV`: Environment (affects API endpoints and caching)

## Output Files

All generated files are saved to `public/sitemaps/` and include timestamps to avoid conflicts:

### 📋 **Sitemap Files**
- `sitemap.xml` - Main sitemap with core pages
- `sitemap-index.xml` - Index listing all sitemaps
- `state/{state}/sitemap/{index}.xml` - State-specific sitemaps
- `candidates/{state}/sitemap/{index}.xml` - Candidate sitemaps

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
- **Time**: ~7 minutes for 200K URLs
- **Concurrency**: 20 parallel requests
- **Success Rate**: ~94% valid URLs
- **Average Response**: ~200ms per URL

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
# In your CI/CD pipeline
npm run build:sitemaps
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
- Use pruning instead of re-validation when possible
- Adjust concurrency limit if overwhelming servers
- Consider validating subsets of URLs

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
- **Quality**: URL validation and pruning capabilities
- **Scalability**: Handles 200K+ URLs efficiently
- **Maintenance**: Easy cleanup of invalid URLs

The dynamic routes have been disabled (renamed to `.disabled`) to prevent conflicts with static files.

---

*For more information about the sitemap system architecture and implementation phases, see `.ai/static-sitemap-generation-plan.md`* 