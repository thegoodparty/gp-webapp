import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export async function fetchUserClientCampaign() {
  try {
    return await clientFetch(apiRoutes.campaign.get)
  } catch (e) {
    console.error('error', e)
    return false
  }
}
