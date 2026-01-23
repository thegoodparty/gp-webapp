import pageMetaData from 'helpers/metadataHelper'
import { shortToLongState, isStateAbbreviation } from 'helpers/statesHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import ElectionsCountyPage from './components/ElectionsCountyPage'
import { fetchArticle } from 'app/blog/article/[slug]/utils'
import fetchPlace from '../../shared/fetchPlace'
import PlaceSchema from '../../shared/PlaceSchema'
import { Article } from '../../shared/types'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PageParams {
  state: string
  county: string
}

const fetchCounty = async (state: string, county: string) => {
  const place = await fetchPlace({
    slug: `${state}/${county}`,
    includeChildren: true,
    includeRaces: true,
  })
  return place
}

const year = new Date().getFullYear()

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { state } = await params
  if (state.length === 2) {
    const upperState = state.toUpperCase()
    const stateName = isStateAbbreviation(upperState) ? shortToLongState[upperState] : undefined
    const county = await fetchCounty(state, (await params).county)

    const meta = pageMetaData({
      title: `Run for Office in ${
        county?.name || 'a'
      } county, ${stateName} ${year}`,
      description: `Learn about available opportunities to run for office in ${
        county?.name || 'a'
      } county, ${stateName} and tips for launching a successful campaign.`,
      slug: `/elections/${state}/${(await params).county}`,
    })
    return meta
  }
  return {}
}

export default async function Page({ params }: { params: Promise<PageParams> }): Promise<React.JSX.Element> {
  const { state } = await params
  const upperState = state.toUpperCase()
  if (
    !state ||
    (state.length === 2 && !isStateAbbreviation(upperState))
  ) {
    notFound()
  }
  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ]

  const articles: Article[] = await Promise.all(
    articleSlugs.map((slug) => fetchArticle(slug)),
  )

  const county = await fetchPlace({ slug: `${state}/${(await params).county}` })
  if (!county) {
    // try to append county to the slug and redirect if found
    const newSlug = `${state}/${(await params).county}-county`
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
