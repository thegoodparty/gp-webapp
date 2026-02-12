import pageMetaData from 'helpers/metadataHelper'
import CandidatePage from './components/CandidatePage'
import { permanentRedirect } from 'next/navigation'
import slugify from 'slugify'
import { apiRoutes, electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { PublicCandidateProvider } from './components/PublicCandidateProvider'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import CandidateSchema from './components/CandidateSchema'
import { Metadata } from 'next'

export const revalidate = 3600
export const dynamic = 'force-static'

interface FetchCandidateParams {
  slug?: string
  raceSlug?: string
  includeStances?: boolean
  includeRace?: boolean
}

interface ClaimedCandidateParams {
  raceId?: string
  firstName: string
  lastName: string
}

interface PageParams {
  params: Promise<{ name: string; office: string }>
}

const fetchCandidate = async ({
  slug,
  raceSlug,
  includeStances = false,
  includeRace = false,
}: FetchCandidateParams) => {
  const api = electionApiRoutes.candidacies.find.path
  const payload = {
    ...(slug && { slug }),
    ...(raceSlug && { raceSlug }),
    includeStances,
    includeRace,
  }
  const res = await unAuthElectionFetch(api, payload, 3600)

  if (Array.isArray(res)) {
    return res[0]
  }
  return false
}

interface ClaimedCandidateDetails {
  occupation?: string
  funFact?: string
  party?: string
  pastExperience?: string
  runningAgainst?: { name: string; party: string; description: string }[]
  customIssues?: { title: string; description: string }[]
}

interface ClaimedCandidateResponse {
  statusCode?: number
  details?: ClaimedCandidateDetails
  campaignPositions?: {
    id: number
    topIssueId: number
    positionId: number
    description: string
  }[]
}

const fetchClaimedCandidate = async ({
  raceId,
  firstName,
  lastName,
}: ClaimedCandidateParams): Promise<ClaimedCandidateResponse | false> => {
  try {
    if (!raceId) {
      return false
    }
    const api = apiRoutes.publicCampaign.find.path
    const payload = { raceId, firstName, lastName }
    const res = await unAuthFetch<ClaimedCandidateResponse>(api, payload, 3600)
    if (res.statusCode === 404) {
      return false
    }
    return res
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { name, office } = await params
  const slug = `${slugify(name)}/${slugify(office)}`
  const candidate = await fetchCandidate({ slug })
  const title = candidate
    ? `${candidate.firstName} ${candidate.lastName} for ${candidate.positionName} | GoodParty.org`
    : 'Candidate | GoodParty.org'
  const description =
    candidate?.about ||
    'Learn more about independent candidates at GoodParty.org.'
  const image = candidate?.image
  const meta = pageMetaData({
    title,
    description,
    image,
    slug: `/candidate/${slug}`,
  })
  return meta
}

export default async function Page({
  params,
}: PageParams): Promise<React.JSX.Element> {
  const { name, office } = await params
  const slug = `${slugify(name)}/${slugify(office)}`
  const candidate = await fetchCandidate({
    slug,
    includeStances: true,
    includeRace: true,
  })
  if (!candidate) {
    permanentRedirect('/candidates')
  }

  const claimedCandidate = await fetchClaimedCandidate({
    raceId: candidate.Race?.brHashId,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
  })

  candidate.claimed = claimedCandidate || false

  return (
    <PublicCandidateProvider candidate={candidate}>
      <CandidatePage />
      <CandidateSchema
        candidate={candidate}
        slug={`candidate/${name}/${office}`}
      />
    </PublicCandidateProvider>
  )
}
