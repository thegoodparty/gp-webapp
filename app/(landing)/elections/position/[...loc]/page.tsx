import pageMetaData from 'helpers/metadataHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import PositionPage from './components/PositionPage'
import PositionSchema from './components/PositionSchema'
import { fetchArticle, type ArticleContent } from 'app/blog/article/[slug]/utils'
import { PositionLevel } from '../../shared/PositionLevel'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { electionApiRoutes } from 'gpApi/routes'
import type { ComponentProps } from 'react'
import type { Metadata } from 'next'

type PositionPageProps = ComponentProps<typeof PositionPage>
type PositionRace = PositionPageProps['race']
type PositionCandidates = PositionPageProps['candidates']
type PositionArticles = PositionPageProps['articles']

interface Params {
  loc: string[]
}

const fetchRace = async (raceSlug: string): Promise<PositionRace | null> => {
  const api = electionApiRoutes.races.find.path
  const payload = {
    raceSlug,
    includePlace: true,
  }

  const res = await unAuthElectionFetch(api, payload, 3600)
  if (Array.isArray(res) && res.length > 0) {
    return res[0]
  }
  return null
}

const fetchCandidates = async (
  raceSlug: string,
): Promise<PositionCandidates> => {
  const api = electionApiRoutes.candidacies.find.path
  const payload = {
    raceSlug,
  }

  const res = await unAuthElectionFetch(api, payload, 3600)
  if (Array.isArray(res) && res.length > 0) {
    return res
  }
  return null
}

interface ParsedLoc {
  state: string
  county?: string
  city?: string
  positionSlug: string
}

const parseLoc = (loc: string[]): ParsedLoc => {
  const state = loc[0]!
  const positionSlug = loc[loc.length - 1]!
  let county, city
  if (loc.length === 4) {
    county = loc[1]
    city = loc[2]
  }
  if (loc.length === 3) {
    county = loc[1]
  }
  return { state, county, city, positionSlug }
}

export const generateMetadata = async ({
  params,
}: {
  params: Params
}): Promise<Metadata> => {
  const { loc } = params
  const race = await fetchRace(loc.join('/'))
  const slug = `elections/position/${loc.join('/')}`

  const {
    positionLevel,
    positionDescription,
    Place,
    state: raceState,
  } = race || {}

  let locStr = Place?.name || ''
  if (!positionLevel || positionLevel.toUpperCase() === PositionLevel.LOCAL) {
    locStr = `${Place?.name || ''}, ${raceState?.toUpperCase()}`
  }
  if (positionLevel?.toUpperCase() === PositionLevel.CITY) {
    locStr += ` City, ${raceState?.toUpperCase() || ''}`
  } else if (positionLevel?.toUpperCase() === PositionLevel.COUNTY) {
    locStr += ` County, ${raceState?.toUpperCase() || ''}`
  }

  const meta = pageMetaData({
    title: `Run for ${race?.normalizedPositionName || ''} in ${locStr}`,
    description: `Learn the details about running for ${race?.normalizedPositionName || ''} in ${locStr}. Learn the requirements to run, what the job entails, and helpful tips for running a successful campaign. ${positionDescription}`,
    slug,
  })
  return meta
}

const Page = async ({
  params,
}: {
  params: Promise<Params>
}): Promise<React.JSX.Element> => {
  const { loc } = await params
  if (!loc || loc.length === 0 || loc.length > 4) {
    return notFound()
  }

  const race = await fetchRace(loc.join('/'))
  const candidates = await fetchCandidates(loc.join('/'))
  if (!race) {
    const newSlug = `${loc[0]}/${loc[1]}-county/${loc[2]}`
    const newRace = await fetchRace(newSlug)

    if (newRace) {
      permanentRedirect(`/elections/position/${newSlug}`)
    }
    return notFound()
  }

  const { county, city } = parseLoc(loc)

  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ]
  const buildArticle = (
    content: ArticleContent,
  ): PositionArticles[number] => ({
    title: content.title,
    slug: content.slug,
    summary: content.summary,
    publishDate: content.publishDate,
    mainImage: content.mainImage?.url
      ? {
          url: content.mainImage.url,
          alt: content.mainImage.alt,
        }
      : undefined,
  })
  const articles: PositionArticles = []
  for (const slug of articleSlugs) {
    const content = await fetchArticle(slug)
    articles.push(buildArticle(content))
  }

  const childProps: PositionPageProps = {
    race,
    otherRaces: [], // We'll need to update this once we have the otherRaces data
    articles,
    positions: race.positionNames || [race.normalizedPositionName],
    county,
    city,
    candidates,
  }
  return (
    <>
      <PositionPage {...childProps} />
      <PositionSchema race={race} loc={loc} />
    </>
  )
}

export default Page
