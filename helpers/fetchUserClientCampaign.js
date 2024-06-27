import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchUserClientCampaign() {
  try {
    const api = gpApi.campaign.get;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
