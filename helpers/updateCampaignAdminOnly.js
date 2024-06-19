import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function updateCampaignAdminOnly(payload) {
  try {
    const api = gpApi.campaign.adminUpdate;
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
