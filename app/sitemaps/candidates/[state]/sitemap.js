/*
note: on local (dev) enviroment the path is http://localhost:4000/sitemaps/candidates/ca/sitemap.xml/4
on production the path is https://www.goodparty.org/sitemaps/candidates/ca/sitemap/4.xml

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
*/

// Added extensive logging to aid debugging [[Phase 1]]
console.log('[SITEMAP] Candidates sitemap module loaded')

import { flatStates } from 'helpers/statesHelper'
import { APP_BASE } from 'appEnv'
import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'

// Fetch candidate slugs with robust error handling
const fetchCandidates = async (state) => {
  const api = electionApiRoutes.candidacies.find.path
  const payload = {
    state,
    columns: 'slug',
  }

  try {
    const response = await unAuthElectionFetch(api, payload, 3600)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error(`[SITEMAP] Error fetching candidates for ${state}:`, error)
    return []
  }
}

const now = new Date()

export async function generateSitemaps() {
  console.log('[SITEMAP] Generating candidate sitemaps for all states')
  return flatStates.map((state, index) => {
    console.log(`[SITEMAP] Mapping state ${state} to index ${index}`)
    return { id: index }
  })
}

export default async function sitemap({ id }) {
  console.log(`[SITEMAP] Generating candidate sitemap for id: ${id}`)

  const stateIndex = parseInt(id, 10)
  if (Number.isNaN(stateIndex) || stateIndex < 0 || stateIndex >= flatStates.length) {
    console.error(`[SITEMAP] Invalid state index: ${id}`)
    return []
  }

  const state = flatStates[stateIndex]?.toLocaleLowerCase()
  console.log(`[SITEMAP] Processing state: ${state}`)

  if (!state) {
    console.error(`[SITEMAP] No state found at index ${stateIndex}`)
    return []
  }

  const candidates = await fetchCandidates(state)
  console.log(`[SITEMAP] Found ${candidates.length} candidates for ${state}`)

  if (!candidates.length) {
    console.log(`[SITEMAP] No candidates for ${state}, returning empty array`)
    return []
  }

  const mainSitemap = []

  candidates.forEach((candidate) => {
    const slug = candidate?.slug?.trim()
    if (slug) {
      mainSitemap.push({
        url: `${APP_BASE}/candidate/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    }
  })

  console.log(`[SITEMAP] Generated ${mainSitemap.length} URLs for ${state}`)
  return mainSitemap
}
