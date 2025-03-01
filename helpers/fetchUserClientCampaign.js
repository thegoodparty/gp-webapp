import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

export async function fetchUserClientCampaign() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.get);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
