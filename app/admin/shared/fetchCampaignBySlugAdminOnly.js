import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

export async function fetchCampaignBySlugAdminOnly(slug) {
  try {
    const api = gpApi.campaign.findBySlug;
    const payload = {
      slug,
    };
    const token = getServerToken();
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
