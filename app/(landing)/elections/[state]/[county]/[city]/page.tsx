import pageMetaData from 'helpers/metadataHelper'
import { shortToLongState, isStateAbbreviation } from 'helpers/statesHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import ElectionsCityPage from './components/ElectionsCityPage'
import { fetchArticle } from 'app/blog/article/[slug]/utils'
import fetchPlace from 'app/(landing)/elections/shared/fetchPlace'
import PlaceSchema from 'app/(landing)/elections/shared/PlaceSchema'
import { Article } from 'app/(landing)/elections/shared/types'

export const revalidate = 3600
export const dynamic = 'force-static'

const year = new Date().getFullYear()

interface PageParams {
  state: string
  county: string
  city: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { state, county, city } = await params
  const upperState = state.toUpperCase()
  const stateName = isStateAbbreviation(upperState)
    ? shortToLongState[upperState]
    : undefined
  const place = await fetchPlace({
    slug: `${state}/${county}/${city}`,
    includeParent: true,
  })

  const meta = pageMetaData({
    title: `Run for Office in ${place?.name}, ${stateName} ${year}`,
    description: `Learn about opportunities to run for office in ${place?.name}, ${stateName} and a helpful tips for a successful campaign.`,
    slug: `/elections/${place?.slug}`,
  })
  return meta
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>
}): Promise<React.JSX.Element> {
  const { state, county, city } = await params
  const upperState = state.toUpperCase()
  if (!state || !isStateAbbreviation(upperState)) {
    notFound()
  }

  const place = await fetchPlace({
    slug: `${state}/${county}/${city}`,
    includeParent: true,
  })
  if (!place) {
    // try to append county to the slug and redirect if found
    const newSlug = `${state}/${county}-county/${city}`
    const newPlace = await fetchPlace({
      slug: newSlug,
      includeParent: false,
      includeRaces: false,
    })
    if (newPlace) {
      permanentRedirect(`/elections/${newSlug}`)
    } else {
      notFound()
    }
  }

  const { Races: races, parent } = place
  place.children = null
  place.races = null

  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ]
  const articles: Article[] = await Promise.all(
    articleSlugs.map((slug) => fetchArticle(slug)),
  )

  const childProps = {
    state,
    municipality: place,
    races,
    county,
    articles,
    parent,
  }

  return (
    <>
      <ElectionsCityPage {...childProps} />
      <PlaceSchema place={place} />
    </>
  )
}
