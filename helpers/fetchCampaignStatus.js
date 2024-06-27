import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchCampaignStatus() {
  try {
    const api = gpApi.user.campaignStatus;
    return await gpFetch(api, false, 10);
  } catch (e) {
    return { status: false };
  }
}
