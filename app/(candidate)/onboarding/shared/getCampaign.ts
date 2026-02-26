import { redirect } from 'next/navigation'
import type { Campaign } from 'helpers/types'
import { serverRequest } from 'gpApi/server-request'

interface GetCampaignParams {
  slug: string
}

export async function fetchUserCampaign(): Promise<Campaign | null> {
  const result = await serverRequest(
    'GET /v1/campaigns/mine',
    {},
    { ignoreResponseError: true },
  )

  if (!result.ok) {
    return null
  }
  return result.data
}

export default async function getCampaign(
  params: GetCampaignParams,
): Promise<Campaign | false> {
  const { slug } = params
  const campaign = await fetchUserCampaign()

  if (!campaign || campaign.slug !== slug) {
    redirect('/run-for-office')
  }
  return campaign
}
