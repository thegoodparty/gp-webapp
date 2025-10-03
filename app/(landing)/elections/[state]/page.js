import pageMetaData from 'helpers/metadataHelper'
import ElectionsStatePage from './components/ElectionsStatePage'
import { shortToLongState } from 'helpers/statesHelper'
import { notFound } from 'next/navigation'
import { fetchArticle } from 'app/blog/article/[slug]/utils'
import fetchPlace from '../shared/fetchPlace'

export const revalidate = 3600
export const dynamic = 'force-static'

const year = new Date().getFullYear()

export async function generateMetadata({ params }) {
  const { state } = params
  const stateName = shortToLongState[state.toUpperCase()]

  const meta = pageMetaData({
    title: `Run for Office in ${stateName} ${year}`,
    description: `Learn about available opportunities to run for office in ${stateName} and tips for launching a successful campaign.`,
    slug: `/elections/${state}`,
  })
  return meta
}

export default async function Page({ params }) {
  const { state } = params
  if (!state || !shortToLongState[state.toUpperCase()]) {
    notFound()
  }

  const {
    counties,
    districts,
    others,
    children,
    Races: races,
  } = await fetchPlace({ slug: state, categorizeChildren: true })

  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ]
  const articles = []
  for (const slug of articleSlugs) {
    const content = await fetchArticle(slug)
    articles.push(content)
  }

  const childProps = {
    state,
    categorizedChildren: { counties, districts, others },
    children,
    races,
    articles,
  }

  return <ElectionsStatePage {...childProps} />
}
