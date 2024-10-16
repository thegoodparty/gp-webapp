import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { setUserCookie } from 'helpers/cookieHelper';

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/i;

export async function updateUser(updateFields = {}) {
  try {
    const api = gpApi.user.updateUser;

    const response = await gpFetch(api, updateFields);
    const { user } = response;
    setUserCookie(user);
    return user;
  } catch (error) {
    console.log('Error updating user', error);
  }
}
