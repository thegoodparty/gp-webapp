'use client'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export async function updateCampaignAdminOnly(
  payload: Record<string, string | number | boolean | object | null>,
): Promise<Record<string, string | number | boolean | object | null> | false> {
  try {
    const resp: ApiResponse<Record<
      string,
      string | number | boolean | object | null
    >> = await clientFetch(apiRoutes.admin.campaign.update, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
