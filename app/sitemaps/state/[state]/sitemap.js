/*
note: on local (dev) enviroment the path is http://localhost:4000/sitemaps/state/ca/sitemap.xml/4
on production the path is https://www.getelected.com/sitemaps/state/ca/sitemap/4.xml

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
*/

import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { flatStates } from 'helpers/statesHelper'
import { APP_BASE } from 'appEnv'

const fetchStatePlaces = async (state) => {
  const api = gpApi.elections.places
  const payload = {
    state,
    placeColumns: 'slug',
  }

  return await gpFetch(api, payload, 3600)
}

const fetchStateRaces = async (state) => {
  const api = gpApi.elections.races
  const payload = {
    state,
    raceColumns: 'slug',
  }

  return await gpFetch(api, payload, 3600)
}

const now = new Date()

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed

  return flatStates.map((state, index) => {
    return {
      id: index,
    }
  })
}

export default async function sitemap({ id }) {
  try {
    const state = flatStates[id].toLocaleLowerCase()

    const places = await fetchStatePlaces(state)
    const races = await fetchStateRaces(state)

    const mainSitemap = []
    // state url
    const urls = []

    places.forEach((place) => {
      urls.push(`/elections/${place.slug}`)
    })

    races.forEach((race) => {
      urls.push(`/elections/position/${race.slug}`)
    })

    urls.forEach((url) => {
      mainSitemap.push({
        url: `${APP_BASE}${url}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
    return mainSitemap
  } catch (e) {
    return []
  }
}
