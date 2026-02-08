import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import type { Campaign } from 'helpers/types'

interface GetCampaignParams {
  slug: string
}

export async function fetchUserCampaign(): Promise<Campaign | null> {
  try {
    const resp = await serverFetch<Campaign>(apiRoutes.campaign.get)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return null
  }
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
