import { clientFetch, ApiResponse } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { Ecanvasser } from 'helpers/types';

export const syncEcanvasser = async (
  campaignId: number,
  force = false
): Promise<Ecanvasser | false> => {
  try {
    const payload = {
      campaignId,
      force,
    };
    const resp: ApiResponse<Ecanvasser> = await clientFetch<Ecanvasser>(apiRoutes.ecanvasser.sync, payload);
    return resp.data;
  } catch (e) {
    console.error('error syncEcanvasser', e);
    return false;
  }
};
