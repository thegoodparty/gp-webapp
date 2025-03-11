import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const syncEcanvasser = async (campaignId, force = false) => {
  try {
    const payload = {
      campaignId,
      force,
    };
    const resp = await clientFetch(apiRoutes.ecanvasser.sync, payload);
    return resp.data;
  } catch (e) {
    console.log('error syncEcanvasser', e);
    return false;
  }
};
