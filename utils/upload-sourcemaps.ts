import { sync as glob } from 'fast-glob'
import pMap from 'p-map'
import type { WebpackPluginInstance } from 'webpack'
import { exec as _exec } from 'child_process'
import { promisify } from 'util'

const exec = promisify(_exec)

export const newRelicSourceMapPlugin: WebpackPluginInstance = {
  apply: (compiler) => {
    compiler.hooks.afterEmit.tapPromise('NewRelicSourceMapPlugin', async () => {
      if (!process.env.CI) {
        console.log('Skipping sourcemap upload: CI is not set')
        return
      }
      if (!process.env.NR_API_KEY) {
        throw new Error('NR_API_KEY is not set')
      }

      const sourcemaps = glob(`${__dirname}/../.next/static/chunks/**/*.js.map`)

      console.log(`Found ${sourcemaps.length} sourcemaps for upload`)

      // It's important to parallelize this upload. NextJS generates lots of sourcemap files (for our project,
      // ~280 files as of Jan 2026), and NewRelic only allows uploading one at a time.

      const baseUrls = [
        'https://goodparty.org',
        `https://${process.env.VERCEL_URL}`,
        `https://${process.env.VERCEL_BRANCH_URL}`,
      ]

      await pMap(
        sourcemaps,
        async (sourcemap) => {
          for (const baseUrl of baseUrls) {
            const jsPath = sourcemap
              .replace('.js.map', '.js')
              .replace(`${__dirname}/../.next/`, `_next/`)
              // We need to url-encode -- that's how the url surfaces in New Relic, and it needs to
              // match exactly.
              .split('/')
              .map((segment) => encodeURIComponent(segment))
              .join('/')

            const jsUrl = `${baseUrl}/${jsPath}`

            await exec(
              `npx publish-sourcemap '${sourcemap}' '${jsUrl}' --applicationId '1120481134'`,
            )
          }
        },
        { concurrency: 25 },
      )

      console.log(`✅ ${sourcemaps.length} sourcemaps uploaded to New Relic`)
    })
  },
}
