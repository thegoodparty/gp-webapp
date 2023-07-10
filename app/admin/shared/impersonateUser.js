import { setCookie } from 'helpers/cookieHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function handleImpersonateUser(email) {
  try {
    const api = gpApi.admin.impersonateUser;
    const payload = {
      email,
    };
    const resp = await gpFetch(api, payload);
    if (resp?.token) {
      setCookie('impersonateToken', resp.token);
      return true;
    }
  } catch (e) {
    console.log('error', e);
  }
  return false;
}
