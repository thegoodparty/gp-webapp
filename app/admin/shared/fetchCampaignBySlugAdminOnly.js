import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

export async function fetchCampaignBySlugAdminOnly(slug) {
  try {
    const payload = {
      slug,
    };
    const resp = await serverFetch(apiRoutes.campaign.findBySlug, payload);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}
