import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { Campaign } from 'helpers/types'

export async function fetchCampaignBySlugAdminOnly(
  slug: string,
): Promise<Campaign | false> {
  try {
    const payload = {
      slug,
    }
    const resp = await serverFetch(apiRoutes.campaign.findBySlug, payload)
    return resp.data as Campaign
  } catch (e) {
    console.error('error', e)
    return false
  }
}
