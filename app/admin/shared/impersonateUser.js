import { setCookie } from 'helpers/cookieHelper';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export async function handleImpersonateUser(email) {
  try {
    const payload = {
      email,
    };
    const resp = await clientFetch(apiRoutes.admin.user.impersonate, payload);
    const token = resp.data?.token;
    if (token) {
      setCookie('impersonateToken', token);
      return true;
    }
  } catch (e) {
    console.error('error', e);
  }
  return false;
}
