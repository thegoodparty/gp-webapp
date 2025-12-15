import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export interface Campaign {
  id: number
  slug: string
  firstName?: string
  lastName?: string
  office?: string
  state?: string
  currentStep?: string
  details?: {
    [key: string]: string | number | boolean | null | undefined
  }
}

interface GetCampaignParams {
  slug: string
}

export async function fetchUserCampaign(): Promise<Campaign | false> {
  try {
    const resp = await serverFetch<Campaign>(apiRoutes.campaign.get)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
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
