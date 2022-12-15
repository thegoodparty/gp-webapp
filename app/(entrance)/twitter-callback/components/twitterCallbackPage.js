'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import { redirect } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { globalSnackbarState } from '@shared/utils/Snackbar';

async function verifyToken(oauthToken, oauthVerifier) {
  try {
    const api = gpApi.entrance.verifyTwitterToken;
    const payload = {
      oauthToken,
      oauthVerifier,
    };
    const { user, token } = await gpFetch(api, payload);
    console.log('call returned with ', user, token);
    if (user && token) {
      setUserCookie(user);
      setCookie('token', token);
      console.log('set cookies');

      return user;
    }
    console.log('returning false');
    return false;
  } catch (e) {
    console.log('got an error', e);
    return false;
  }
}
let twitterCalled = false;
export default function TwitterCallbackPage() {
  const searchParams = useSearchParams();
  const userState = useHookstate(globalUserState);
  const snackbarState = useHookstate(globalSnackbarState);
  const router = useRouter();

  const oauthToken = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');
  // redirect('/profile');
  useEffect(() => {
    if (!oauthToken || !oauthVerifier) {
      redirect('/');
    } else {
      handleLogin();
    }
  }, []);

  const handleLogin = async () => {
    if (twitterCalled) {
      return;
    }
    twitterCalled = true;
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Verifying...',
        isError: false,
      };
    });
    const { user } = await verifyToken(oauthToken, oauthVerifier);
    if (user) {
      userState.set(() => user);
      window.location.href = '/';
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error logging you in.',
          isError: true,
        };
      });
    }
  };

  return (
    <div>
      <LoadingAnimation />
    </div>
  );
}
