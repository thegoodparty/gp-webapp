import pageMetaData from 'helpers/metadataHelper'
import CandidatesPage from '../components/CandidatesPage'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { shortToLongState, isStateAbbreviation } from 'helpers/statesHelper'
import { notFound } from 'next/navigation'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { SearchParams } from 'next/dist/server/request/search-params'

const fetchCount = async (
  state: string,
  onlyWinners = false,
): Promise<{ count: number }> => {
  const resp = await serverFetch<{ count: number }>(
    apiRoutes.campaign.map.count,
    {
      state,
      results: onlyWinners ? true : undefined,
    },
    { revalidate: 3600 },
  )
  return resp.data
}

export async function generateMetadata() {
  const meta = pageMetaData({
    title: 'GoodParty.org Certified Independent Candidates',
    description:
      'Find independent, people-powered, and anti-corruption candidates running for office in your area. Search by office type, name, party affiliation, and more.',
    slug: `/candidates`,
  })
  return meta
}

interface PageProps {
  params: { state: string }
  searchParams: SearchParams
}

export default async function Page({ params, searchParams }: PageProps) {
  const { state } = params
  const upperState = state.toUpperCase()

  if (!isStateAbbreviation(upperState)) {
    notFound()
    return
  }

  const longState = shortToLongState[upperState]
  await adminAccessOnly()
  const { count } = await fetchCount(upperState, true)
  const childProps = { count, longState, state: upperState, searchParams }
  return <CandidatesPage {...childProps} />
}
