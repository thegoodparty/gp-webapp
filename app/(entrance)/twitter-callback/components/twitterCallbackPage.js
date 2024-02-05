'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import { redirect } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { globalUserState } from '@shared/layouts/navigation/ProfileDropdown';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import {
  deleteCookie,
  getCookie,
  setCookie,
  setUserCookie,
} from 'helpers/cookieHelper';
import { createCampaign } from 'app/(company)/run-for-office/components/RunCampaignButton';

async function verifyToken(oauthToken, oauthVerifier) {
  try {
    const api = gpApi.entrance.verifyTwitterToken;
    const payload = {
      oauthToken,
      oauthVerifier,
    };
    const { user, token } = await gpFetch(api, payload);
    if (user && token) {
      setUserCookie(user);
      setCookie('token', token);

      return user;
    }
    return false;
  } catch (e) {
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
      const afterAction = getCookie('afterAction');
      // if (afterAction === 'createCampaign') {
      //   createCampaign(router);
      // } else {
      const returnUrl = getCookie('returnUrl');
      if (returnUrl) {
        deleteCookie('returnUrl');
        router.push(returnUrl);
      } else {
        createCampaign(router);
      }
      // }
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
    const user = await verifyToken(oauthToken, oauthVerifier);
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
