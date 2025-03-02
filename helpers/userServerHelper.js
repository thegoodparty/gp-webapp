import { cookies } from 'next/headers';

const determineImpersonateCookieOrNot = (cookieName, impersonateCookieName) => {
  const nextCookies = cookies();
  const cookie = nextCookies.get(cookieName);
  const impersonateCookie = nextCookies.get(impersonateCookieName);
  if (impersonateCookie?.value) {
    return decodeURIComponent(impersonateCookie.value);
  } else if (cookie?.value) {
    return decodeURIComponent(cookie.value);
  }
  return false;
};

export const getServerToken = () =>
  determineImpersonateCookieOrNot('token', 'impersonateToken');

export const getServerUser = () => {
  const userJSON = determineImpersonateCookieOrNot('user', 'impersonateUser');
  return new Promise((resolve) => {
    try {
      if (userJSON && typeof userJSON === 'object') {
        resolve(userJSON);
      }
      resolve(userJSON ? JSON.parse(userJSON) : null);
    } catch (e) {
      console.log('Error in getServerUser', e);
      resolve(null);
    }
  });
};
