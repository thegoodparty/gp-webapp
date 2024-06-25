import { cookies } from 'next/headers';

export const getServerToken = () => {
  const nextCookies = cookies();
  // console.log('nextCookies', nextCookies);
  let tokenCookieName = 'token';
  if (process.env.NEXT_PUBLIC_APP_BASE === 'https://goodparty.org') {
    tokenCookieName = 'token_prod';
  } else if (process.env.NEXT_PUBLIC_APP_BASE === 'https://dev.goodparty.org') {
    tokenCookieName = 'token_dev';
  } else if (process.env.NEXT_PUBLIC_APP_BASE === 'https://qa.goodparty.org') {
    tokenCookieName = 'token_qa';
  }
  const cookie = nextCookies.get(tokenCookieName);
  const impersonateCookie = nextCookies.get('impersonateToken');
  if (impersonateCookie?.value) {
    return impersonateCookie.value;
  } else if (decodeURIComponent(cookie?.value)) {
    return decodeURIComponent(cookie.value);
  }
  return false;
};

export const getServerUser = () => {
  let userCookieName = 'user';
  if (process.env.NEXT_PUBLIC_APP_BASE === 'https://goodparty.org') {
    userCookieName = 'user_prod';
  } else if (process.env.NEXT_PUBLIC_APP_BASE === 'https://dev.goodparty.org') {
    userCookieName = 'user_dev';
  } else if (process.env.NEXT_PUBLIC_APP_BASE === 'https://qa.goodparty.org') {
    userCookieName = 'user_qa';
  }

  const nextCookies = cookies();
  const cookie = nextCookies.get(userCookieName);
  const impersonateCookie = nextCookies.get('impersonateUser');
  if (impersonateCookie?.value) {
    return JSON.parse(decodeURIComponent(impersonateCookie.value));
  } else if (cookie?.value) {
    return JSON.parse(decodeURIComponent(cookie.value));
  }
  return false;
};
