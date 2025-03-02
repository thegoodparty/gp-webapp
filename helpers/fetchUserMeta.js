import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

export async function fetchUserMeta() {
  try {
    const resp = await serverFetch(apiRoutes.user.getMeta);
    return resp.data;
  } catch (e) {
    console.log('error at fetchUserMeta', e);
    return {};
  }
}
