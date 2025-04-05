import pageMetaData from 'helpers/metadataHelper'
import CandidatePage from './components/CandidatePage'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { permanentRedirect } from 'next/navigation'
import CandidateSchema from './components/CandidateSchema'

export const revalidate = 3600
export const dynamic = 'force-static'

export const fetchCandidate = async (name, office, bustCache) => {
  const api = gpApi.candidate.find
  const payload = {
    name,
    office,
    bustCache,
  }
  return await gpFetch(api, payload, 3600)
}

export async function generateMetadata({ params, searchParams }) {
  const { bustCache } = searchParams
  const { name, office } = params
  const { candidate } = await fetchCandidate(
    name,
    office,
    bustCache === 'true',
  )
  const { firstName, lastName, about, image } = candidate || {}
  const meta = pageMetaData({
    title: `${firstName} ${lastName} for ${candidate?.office} | GoodParty.org`,
    description: about,
    image,
    slug: `/candidate/${name}/${office}`,
  })
  return meta
}

export default async function Page({ params, searchParams }) {
  const { bustCache } = searchParams
  const { name, office } = params
  const { candidate } = await fetchCandidate(
    name,
    office,
    bustCache === 'true',
  )
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
