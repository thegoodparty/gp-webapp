import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchUserCampaignClient() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    return await gpFetch(api);
  } catch (e) {
    console.log('error1', JSON.stringify(e));
    return false;
  }
}
