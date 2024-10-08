import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

export async function fetchUserMeta() {
  try {
    const api = gpApi.user.getMeta;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchUserMeta', e);
    return {};
  }
}
