import { cookies } from 'next/headers';

export const getServerToken = () => {
  const nextCookies = cookies();
  const cookie = nextCookies.get('token');
  return cookie ? nextCookies.get('token').value : false;
};

export const getServerUser = () => {
  const nextCookies = cookies();
  const cookie = nextCookies.get('user');

  return cookie ? JSON.parse(cookie.value) : false;
};
