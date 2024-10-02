'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteUserCookies } from 'helpers/cookieHelper';
import { useEffect } from 'react';
// import { redirect } from 'next/navigation';

async function fetchLogout() {
  // clear cookies set by server.
  try {
    const api = gpApi.user.logout;
    return await gpFetch(api, false, false);
  } catch (e) {
    console.log('error at fetchLogout', e);
    return false;
  }
}

export default function LogoutPage() {
  useEffect(() => {
    async function logout() {
      deleteUserCookies();
      await fetchLogout();
      window.location.replace('/');
    }
    logout();
  }, []);

  // TODO: we can show loading state here while logging out...
  return <></>;
}
