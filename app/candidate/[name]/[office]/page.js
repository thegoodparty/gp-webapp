import pageMetaData from 'helpers/metadataHelper'
import CandidatePage from './components/CandidatePage'
import { permanentRedirect } from 'next/navigation'
import CandidateSchema from './components/CandidateSchema'
import slugify from 'slugify'
import { electionApiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'

export const revalidate = 3600
export const dynamic = 'force-static'

export const fetchCandidate = async ({slug, raceSlug, includeStances = false}) => {
  const api = electionApiRoutes.candidacies.find.path
  const payload = {
    ...(slug && {slug}),
    ...(raceSlug && {raceSlug}),
    includeStances,
  }
  const res = await unAuthFetch(api, payload, 3600)

  if (Array.isArray(res)) {
    return res[0]
  }
  return false
}

export async function generateMetadata({ params, searchParams }) {
  const { name, office } = params
  const slug = `${slugify(name)}/${slugify(office)}`
  const candidate = await fetchCandidate({slug})
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
  const candidate = await fetchCandidate({slug, includeStances: true})
  if (!candidate) {
    permanentRedirect('/candidates')
  }

  const childProps = { candidate }
  return (
    <>
      <CandidatePage {...childProps} />
      <CandidateSchema {...childProps} slug={`candidate/${name}/${office}`} />
    </>
  )
}
