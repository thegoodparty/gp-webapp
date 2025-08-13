import pageMetaData from 'helpers/metadataHelper'
import CandidatePage from './components/CandidatePage'
import { permanentRedirect } from 'next/navigation'
// import CandidateSchema from './components/CandidateSchema'
import slugify from 'slugify'
import { apiRoutes, electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { PublicCandidateProvider } from './components/PublicCandidateProvider'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import CandidateSchema from './components/CandidateSchema'

export const revalidate = 3600
export const dynamic = 'force-static'

export const fetchCandidate = async ({
  slug,
  raceSlug,
  includeStances = false,
  includeRace = false,
}) => {
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

const fetchClaimedCandidate = async ({ raceId, firstName, lastName }) => {
  try {
    const api = apiRoutes.publicCampaign.find.path
    const payload = { raceId, firstName, lastName }
    const res = await unAuthFetch(api, payload, 3600)
    if (res.statusCode === 404) {
      return false
    }
    return res
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function generateMetadata({ params, searchParams }) {
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

export default async function Page({ params, searchParams }) {
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
    raceId: candidate.raceId,
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
