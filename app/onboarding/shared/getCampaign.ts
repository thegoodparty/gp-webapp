import { redirect } from 'next/navigation'
import type { Campaign } from 'helpers/types'
import { serverRequest } from 'gpApi/server-request'
import { getServerToken, isTokenExpired } from 'helpers/tokenHelper'

interface GetCampaignParams {
  slug: string
}

export async function fetchUserCampaign(): Promise<Campaign | null> {
  // These next two lines of code are very important. Without these lines of code,
  // we receive ~200K unauthed requests a day to this endpoint, which is ~ half our
  // API traffic as of Mar 6 2026. Likely bots just hammering the site.
  const token = await getServerToken()
  if (!token || isTokenExpired(token)) {
    return null
  }

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
