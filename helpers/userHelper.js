import { setUserCookie } from 'helpers/cookieHelper';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/i;

export async function updateUser(updateFields = {}) {
  try {
    const resp = await clientFetch(apiRoutes.user.updateUser, updateFields);
    const user = resp.data;
    setUserCookie(user);
    return user;
  } catch (error) {
    console.log('Error updating user', error);
  }
}

export function userIsAdmin(user) {
  return userHasRole(user, USER_ROLES.ADMIN);
}

export function userHasRole(user, role) {
  return user?.roles?.includes(role);
}

export const USER_ROLES = {
  SALES: 'sales',
  CAMPAIGN: 'campaign',
  ADMIN: 'admin',
  CANDIDATE: 'candidate',
  CAMPAIGN_MANAGER: 'campaignManager',
  DEMO: 'demo',
};
