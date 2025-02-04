import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

export async function fetchCampaignStatus() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.status, undefined, {
      revalidate: 10,
    });
    return resp.data;
  } catch (e) {
    return { status: false };
  }
}
