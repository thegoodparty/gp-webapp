import pageMetaData from 'helpers/metadataHelper'
import { shortToLongState } from 'helpers/statesHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import ElectionsCountyPage from './components/ElectionsCountyPage'
import { fetchArticle } from 'app/blog/article/[slug]/page'
import fetchPlace from '../../shared/fetchPlace'
import PlaceSchema from '../../shared/PlaceSchema'
export const revalidate = 3600
export const dynamic = 'force-static'

export const fetchCounty = async (state, county) => {
  const place = await fetchPlace({
    slug: `${state}/${county}`,
    includeChildren: true,
    includeRaces: true,
  })
  return place
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

  const county = await fetchPlace({ slug: `${state}/${params.county}` })
  if (!county) {
    // try to append county to the slug and redirect if found
    const newSlug = `${state}/${params.county}-county`
    const newCounty = await fetchPlace({
      slug: newSlug,
      includeParent: false,
      includeRaces: false,
    })
    if (newCounty) {
      permanentRedirect(`/elections/${newSlug}`)
    } else {
      notFound()
    }
  }
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

  return (
    <>
      <ElectionsCountyPage {...childProps} />
      <PlaceSchema place={county} />
    </>
  )
}
