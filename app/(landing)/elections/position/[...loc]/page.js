import pageMetaData from 'helpers/metadataHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import PositionPage from './components/PositionPage'
import PositionSchema from './components/PositionSchema'
import { fetchArticle } from 'app/blog/article/[slug]/utils'
import { PositionLevel } from '../../shared/PositionLevel'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { electionApiRoutes } from 'gpApi/routes'

const fetchRace = async (raceSlug) => {
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

const fetchCandidates = async (raceSlug) => {
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

const parseLoc = (loc) => {
  const state = loc[0]
  const positionSlug = loc[loc.length - 1]
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

export async function generateMetadata({ params }) {
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
    title: `Run for ${race?.normalizedPositionName} in ${locStr}`,
    description: `Learn the details about running for ${race?.normalizedPositionName} in ${locStr}. Learn the requirements to run, what the job entails, and helpful tips for running a successful campaign. ${positionDescription}`,
    slug,
  })
  return meta
}

export default async function Page({ params }) {
  const { loc } = params
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

  const { state, county, city } = parseLoc(loc)

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
    race,
    otherRaces: [], // We'll need to update this once we have the otherRaces data
    articles,
    positions: race.positionNames || [race.normalizedPositionName],
    state,
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
