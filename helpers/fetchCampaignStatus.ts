import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

interface CampaignStatusResponse {
  status: boolean | string
  [key: string]: unknown
}

export const fetchCampaignStatus = async (): Promise<CampaignStatusResponse> => {
  try {
    const resp = await clientFetch<CampaignStatusResponse>(apiRoutes.campaign.status, undefined, {
      revalidate: 10,
    })
    return resp.data
  } catch (e) {
    return { status: false }
  }
}

