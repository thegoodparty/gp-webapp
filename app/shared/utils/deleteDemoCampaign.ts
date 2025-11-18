import gpFetch from 'gpApi/gpFetch'
import gpApi from 'gpApi'

export const deleteDemoCampaign = async (): Promise<void> => {
  await gpFetch(gpApi.campaign.deleteDemoCampaign)
}

