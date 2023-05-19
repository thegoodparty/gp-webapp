import { cookies } from 'next/headers';

export const getServerToken = () => {
  const nextCookies = cookies();
  const cookie = nextCookies.get('token');
  return cookie?.value ? nextCookies.get('token').value : false;
};

export const getServerUser = () => {
  const nextCookies = cookies();
  const cookie = nextCookies.get('user');
  return cookie && cookie.value ? JSON.parse(cookie.value) : false;
};

export const getServerCandidateCookie = () => {
  const nextCookies = cookies();
  const cookie = nextCookies.get('candidate');
  console.log('cookie', cookie);
  return cookie?.value;
};
