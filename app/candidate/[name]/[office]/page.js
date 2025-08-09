import pageMetaData from 'helpers/metadataHelper'
import CandidatePage from './components/CandidatePage'
import { permanentRedirect } from 'next/navigation'
// import CandidateSchema from './components/CandidateSchema'
import slugify from 'slugify'
import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { PublicCandidateProvider } from './components/PublicCandidateProvider'

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

export async function generateMetadata({ params, searchParams }) {
  const { name, office } = await params
  const slug = `${slugify(name)}/${slugify(office)}`
  const candidate = await fetchCandidate({ slug })
  const { firstName, lastName, about, image } = candidate || {}
  const meta = pageMetaData({
    title: `${firstName} ${lastName} for ${candidate?.positionName} | GoodParty.org`,
    description: about,
    image,
    slug: `/candidate/${slug}`,
  })
  return meta
}

export default async function Page({ params, searchParams }) {
  const { name, office } = params
  const slug = `${slugify(name)}/${slugify(office)}`
  const candidate = await fetchCandidate({
    slug,
    includeStances: true,
    includeRace: true,
  })
  if (!candidate) {
    permanentRedirect('/candidates')
  }

  const claimedCandidate = false
  candidate.claimed = claimedCandidate

  return (
    <PublicCandidateProvider candidate={candidate}>
      <CandidatePage />
      {/* <CandidateSchema {...childProps} slug={`candidate/${name}/${office}`} /> */}
    </PublicCandidateProvider>
  )
}
