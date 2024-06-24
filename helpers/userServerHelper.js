import { cookies } from 'next/headers';

export const getServerToken = () => {
  const nextCookies = cookies();
  // console.log('nextCookies', nextCookies);
  const cookie = nextCookies.get('token');
  const impersonateCookie = nextCookies.get('impersonateToken');
  if (impersonateCookie?.value) {
    return impersonateCookie.value;
  } else if (decodeURIComponent(cookie?.value)) {
    return decodeURIComponent(cookie.value);
  }
  return false;
};

export const getServerUser = () => {
  const nextCookies = cookies();
  const cookie = nextCookies.get('user');
  const impersonateCookie = nextCookies.get('impersonateUser');
  if (impersonateCookie?.value) {
    return JSON.parse(decodeURIComponent(impersonateCookie.value));
  } else if (cookie?.value) {
    return JSON.parse(decodeURIComponent(cookie.value));
  }
  return false;
};
