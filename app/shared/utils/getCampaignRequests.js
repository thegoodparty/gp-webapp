import gpFetch from 'gpApi/gpFetch'
import gpApi from 'gpApi'

export const getCampaignRequests = async (userId) => {
  try {
    return await gpFetch(gpApi.campaign.campaignRequests.get, { userId })
  } catch (e) {
    console.log('error at getCampaignRequests', e)
    return {}
  }
}
