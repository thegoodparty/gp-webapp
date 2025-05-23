/*
note: on local (dev) enviroment the path is http://localhost:4000/sitemaps/candidates/ca/sitemap.xml/4
on production the path is https://www.goodparty.org/sitemaps/candidates/ca/sitemap/4.xml

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
*/

import { flatStates } from 'helpers/statesHelper'

import { APP_BASE } from 'appEnv'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { electionApiRoutes } from 'gpApi/routes'

const fetchCandidates = async (state) => {
  const api = electionApiRoutes.candidacies.find.path
  const payload = {
    state,
    columns: 'slug',
  }
  return await unAuthElectionFetch(api, payload, 3600)
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
    const candidates = await fetchCandidates(state)

    const mainSitemap = []
    const urls = []
    // state url

    candidates.forEach((candidate) => {
      urls.push(`/candidate/${candidate.slug}`)
    })

    urls.forEach((url) => {
      mainSitemap.push({
        url: `${APP_BASE}${url}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    })
    return mainSitemap
  } catch (e) {
    return []
  }
}
