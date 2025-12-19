import { adminAccessOnly } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import CampaignStatisticsPage from './components/CampaignStatisticsPage'
import { pick } from 'helpers/objectHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { SearchParams } from 'next/dist/server/request/search-params'

interface FiltersPayload {
  id?: string | string[]
  state?: string | string[]
  slug?: string | string[]
  email?: string | string[]
  level?: string | string[]
  primaryElectionDateStart?: string | string[]
  primaryElectionDateEnd?: string | string[]
  generalElectionDateStart?: string | string[]
  generalElectionDateEnd?: string | string[]
  campaignStatus?: string | string[]
  p2vStatus?: string | string[]
  firehose?: string | string[]
}

const FILTER_KEYS: (keyof FiltersPayload)[] = [
  'id',
  'state',
  'slug',
  'email',
  'level',
  'primaryElectionDateStart',
  'primaryElectionDateEnd',
  'generalElectionDateStart',
  'generalElectionDateEnd',
  'campaignStatus',
  'p2vStatus',
  'firehose',
]

const stripEmptyFilters = (filters: FiltersPayload): FiltersPayload => {
  const result: FiltersPayload = {}
  for (const key of FILTER_KEYS) {
    const value = filters[key]
    if (value !== undefined && value !== '') {
      result[key] = value
    }
  }
  return result
}

interface Campaign {
  id: number
  slug: string
}

const fetchCampaigns = async (filters: FiltersPayload): Promise<Campaign[]> => {
  try {
    const resp = await serverFetch<Campaign[]>(apiRoutes.campaign.list, {
      ...filters,
    })
    return resp.data
  } catch (e) {
    console.error('error', e)
    return []
  }
}

const meta = pageMetaData({
  title: 'Campaign | GOOD PARTY',
  description: 'Admin Campaign.',
  slug: '/admin/campaign-statistics',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<React.JSX.Element> {
  await adminAccessOnly()

  const resolvedSearchParams = await searchParams
  const initialParams = pick(resolvedSearchParams, [
    'id',
    'state',
    'slug',
    'email',
    'level',
    'primaryElectionDateStart',
    'primaryElectionDateEnd',
    'generalElectionDateStart',
    'generalElectionDateEnd',
    'campaignStatus',
    'p2vStatus',
    'firehose',
  ])
  const firehose = initialParams.firehose

  const paramsAreEmpty = Object.values(initialParams).every(
    (val) => val === undefined || val === '',
  )
  let campaigns: Campaign[] = []
  let withParams = false
  if (!paramsAreEmpty && !Boolean(firehose)) {
    withParams = true
    campaigns = await fetchCampaigns(stripEmptyFilters(initialParams))
  }

  const childProps = {
    pathname: '/admin/campaign-statistics',
    title: 'Campaigns',
    campaigns,
    fireHose: Boolean(firehose) && !withParams,
  }

  return <CampaignStatisticsPage {...childProps} />
}
