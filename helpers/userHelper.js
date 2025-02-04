import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { setUserCookie } from 'helpers/cookieHelper';

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/i;

export async function updateUser(updateFields = {}) {
  try {
    const api = gpApi.user.updateUser;

    const user = await gpFetch(api, updateFields);
    setUserCookie(user);
    return user;
  } catch (error) {
    console.log('Error updating user', error);
  }
}

export const USER_ROLES = {
  SALES: 'sales',
  CAMPAIGN: 'campaign',
};
