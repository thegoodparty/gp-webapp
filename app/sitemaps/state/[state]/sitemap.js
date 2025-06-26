/*
note: on local (dev) enviroment the path is http://localhost:4000/sitemaps/state/ca/sitemap.xml/4
on production the path is https://www.getelected.com/sitemaps/state/ca/sitemap/4.xml

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap.
*/

// Added detailed logging for debugging [[Phase 1]]
console.log('[SITEMAP] State elections sitemap module loaded')

import { flatStates } from 'helpers/statesHelper'
import { APP_BASE } from 'appEnv'
import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'

// Fetch helpers with robust error handling
const fetchStatePlaces = async (state) => {
  const api = electionApiRoutes.places.find.path
  const payload = {
    state,
    placeColumns: 'slug',
  }

  try {
    const response = await unAuthElectionFetch(api, payload, 3600)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error(`[SITEMAP] Error fetching places for ${state}:`, error)
    return []
  }
}

const fetchStateRaces = async (state) => {
  const api = electionApiRoutes.races.find.path
  const payload = {
    state,
    raceColumns: 'slug',
  }

  try {
    const response = await unAuthElectionFetch(api, payload, 3600)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error(`[SITEMAP] Error fetching races for ${state}:`, error)
    return []
  }
}

const now = new Date()

export async function generateSitemaps() {
  console.log('[SITEMAP] Generating state election sitemaps for all states')
  return flatStates.map((state, index) => {
    console.log(`[SITEMAP] Mapping state ${state} to index ${index}`)
    return { id: index }
  })
}

export default async function sitemap({ id }) {
  console.log(`[SITEMAP] Generating state elections sitemap for id: ${id}`)

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

  const [places, races] = await Promise.all([
    fetchStatePlaces(state),
    fetchStateRaces(state),
  ])

  if (!places.length && !races.length) {
    console.log(`[SITEMAP] No places or races for ${state}, returning empty array`)
    return []
  }

  const mainSitemap = []

  // Add place URLs
  places.forEach((place) => {
    const slug = place?.slug?.trim()
    if (slug) {
      mainSitemap.push({
        url: `${APP_BASE}/elections/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  })

  // Add race URLs
  races.forEach((race) => {
    const slug = race?.slug?.trim()
    if (slug) {
      mainSitemap.push({
        url: `${APP_BASE}/elections/position/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  })

  console.log(`[SITEMAP] Generated ${mainSitemap.length} URLs for ${state} elections`)
  return mainSitemap
}
