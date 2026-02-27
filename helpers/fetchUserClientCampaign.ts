import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { Campaign } from './types'

export const fetchUserClientCampaign = async (): Promise<
  ApiResponse<Campaign> | false
> => {
  try {
    return await clientFetch<Campaign>(apiRoutes.campaign.get)
  } catch (e) {
    console.error('error', e)
    return false
  }
}
