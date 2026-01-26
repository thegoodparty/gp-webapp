import pageMetaData from 'helpers/metadataHelper'
import ElectionsStatePage from './components/ElectionsStatePage'
import { shortToLongState, isStateAbbreviation } from 'helpers/statesHelper'
import { notFound } from 'next/navigation'
import { fetchArticle } from 'app/blog/article/[slug]/utils'
import fetchPlace from '../shared/fetchPlace'
import { Article } from '../shared/types'

export const revalidate = 3600
export const dynamic = 'force-static'

const year = new Date().getFullYear()

interface PageParams {
  state: string
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { state } = await params
  const upperState = state.toUpperCase()
  const stateName = isStateAbbreviation(upperState) ? shortToLongState[upperState] : undefined

  if (!stateName) {
    return {}
  }

  const meta = pageMetaData({
    title: `Run for Office in ${stateName} ${year}`,
    description: `Learn about available opportunities to run for office in ${stateName} and tips for launching a successful campaign.`,
    slug: `/elections/${state}`,
  })
  return meta
}

export default async function Page({ params }: { params: Promise<PageParams> }): Promise<React.JSX.Element> {
  const { state } = await params
  const upperState = state.toUpperCase()
  if (!state || !isStateAbbreviation(upperState)) {
    notFound()
  }

  const place = await fetchPlace({ slug: state, categorizeChildren: true })

  if (!place) {
    notFound()
  }

  const {
    categorizedChildren,
    children,
    Races: races,
  } = place

  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ]
  const articles: Article[] = []
  for (const slug of articleSlugs) {
    const content = await fetchArticle(slug)
    articles.push(content)
  }

  const childProps = {
    state,
    categorizedChildren: categorizedChildren || {},
    children,
    races,
    articles,
  }

  return <ElectionsStatePage {...childProps} />
}
