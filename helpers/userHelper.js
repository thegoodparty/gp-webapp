import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { setUserCookie } from 'helpers/cookieHelper';

export const getInitials = (user) => {
  if (!user) {
    return '';
  }
  const { firstName, lastName } = user;
  if (!firstName) {
    return false;
  }
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

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
