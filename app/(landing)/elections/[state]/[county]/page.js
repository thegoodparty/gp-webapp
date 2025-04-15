import pageMetaData from 'helpers/metadataHelper'
import { shortToLongState } from 'helpers/statesHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import ElectionsCountyPage from './components/ElectionsCountyPage'
import { fetchArticle } from 'app/blog/article/[slug]/page'

export const revalidate = 3600
export const dynamic = 'force-static'

export const fetchCounty = async (state, county) => {
  const api = gpApi.elections.places
  const payload = {
    slug: `${state}/${county}`,
    includeChildren: true,
    includeRaces: true,
  }

  const res = await gpFetch(api, payload, 3600)
  if (Array.isArray(res)) {
    return res[0]
  }
  return {}
}

const fetchPosition = async (id) => {
  const api = gpApi.race.byRace
  const payload = {
    id,
  }

  return await gpFetch(api, payload, 0)
}

const year = new Date().getFullYear()

export async function generateMetadata({ params }) {
  const { state } = params
  if (state.length === 2) {
    const stateName = shortToLongState[state.toUpperCase()]
    const county = await fetchCounty(state, params.county)

    const meta = pageMetaData({
      title: `Run for Office in ${
        county?.name || 'a'
      } county, ${stateName} ${year}`,
      description: `Learn about available opportunities to run for office in ${
        county?.name || 'a'
      } county, ${stateName} and tips for launching a successful campaign.`,
      slug: `/elections/${state}/${params.county}`,
    })
    return meta
  }
}

export default async function Page({ params }) {
  const { state } = params
  if (
    !state ||
    (state.length === 2 && !shortToLongState[state.toUpperCase()])
  ) {
    notFound()
  }
  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ]

  const articles = await Promise.all(
    articleSlugs.map((slug) => fetchArticle(slug)),
  )

  if (state.length > 2) {
    // state is the slug, county is the id
    const { race } = await fetchPosition(params.county) // this is the id
    if (!race) {
      notFound()
    }
    const { county, municipality, state } = race
    let url = `/elections/position/`
    if (!county && !municipality) {
      url += `${state.toLowerCase()}/`
    }
    if (county) {
      url += `${county.slug}/`
    } else if (municipality) {
      url += `${municipality.slug}/`
    }
    url += race.positionSlug

    permanentRedirect(url)
  }

  const county = await fetchCounty(state, params.county)
  const { children, Races: races } = county
  county.children = null
  county.races = null

  const childProps = {
    state,
    childEntities: children,
    races,
    county,
    articles,
  }

  return <ElectionsCountyPage {...childProps} />
}
