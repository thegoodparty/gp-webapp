import gpFetch from 'gpApi/gpFetch'
import gpApi from 'gpApi'

export const deleteDemoCampaign = async () => {
  await gpFetch(gpApi.campaign.deleteDemoCampaign)
}
