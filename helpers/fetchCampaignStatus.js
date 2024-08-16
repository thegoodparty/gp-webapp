import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchCampaignStatus(serverToken = false) {
  try {
    const api = gpApi.user.campaignStatus;
    return await gpFetch(api, false, 10, serverToken);
  } catch (e) {
    return { status: false };
  }
}
