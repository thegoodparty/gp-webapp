'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import {
  deleteCookie,
  getCookie,
  setCookie,
  setUserCookie,
} from 'helpers/cookieHelper';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import { useRouter } from 'next/navigation';
import { globalUserState } from '@shared/layouts/navigation/ProfileDropdown';
// import TwitterButton from 'app/(entrance)/login/components/TwitterButton';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import GoogleRegisterButton from './GoogleRegisterButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import FacebookRegisterButton from './FacebookRegisterButton';

async function register(payload) {
  try {
    const api = gpApi.entrance.socialLogin;
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SocialRegisterButtons() {
  const snackbarState = useHookstate(globalSnackbarState);
  const userState = useHookstate(globalUserState);
  const router = useRouter();

  const socialRegisterCallback = async (socialUser) => {
    const profile = socialUser._profile;
    const provider = socialUser._provider;
    const { name, email, id, profilePicURL } = profile;
    // for facebook - get a larger image
    let socialPic = profilePicURL;
    let idToken;
    if (provider === 'facebook') {
      try {
        idToken = socialUser._token.accessToken;
      } catch (e) {
        console.log('fb API error');
      }
    } else if (provider === 'google') {
      // for gogole removing the "=s96-c" at the end of the string returns a large image.
      try {
        const largeImg = profilePicURL.substring(0, profilePicURL.indexOf('='));
        if (largeImg) {
          socialPic = largeImg;
        }
        ({ idToken } = socialUser._token);
      } catch (e) {
        console.log('large image error');
      }
    }

    const payload = {
      socialId: id,
      socialProvider: provider,
      socialPic,
      name,
      email,
      socialToken: idToken,
    };
    const { user, token, newUser } = await register(payload);
    console.log('user', user);
    if (user) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: `Welcome ${newUser ? '' : 'back'} to GoodParty.org!`,
          isError: false,
        };
      });
      setUserCookie(user);
      // setCookie('token', token);
      userState.set(() => user);

      const returnUrl = getCookie('returnUrl');

      if (newUser && user.firstName !== '' && returnUrl !== 'profile') {
        await createCampaign();
        return;
      }
      if (newUser) {
        window.location.href = '/set-name';
        return;
      }
      if (returnUrl) {
        deleteCookie('returnUrl');
        window.location.href = returnUrl;
        return;
      }
      console.log('redirecting to home');

      window.location.href = '/';
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error registering',
          isError: true,
        };
      });
    }
  };
  return (
    <>
      <div className="my-8 h-4 relative">
        <div className="border-b border-neutral-200 h-4" />
        <div
          className="absolute w-12 text-center top-1 bg-white text-neutral-500"
          style={{ left: 'calc(50% - 24px)' }}
        >
          Or
        </div>
      </div>

      <GoogleOAuthProvider clientId="28351607421-c9m6ig3vmto6hpke4g96ukgfl3vvko7g.apps.googleusercontent.com">
        <GoogleRegisterButton loginSuccessCallback={socialRegisterCallback} />
      </GoogleOAuthProvider>

      {/* <FacebookRegisterButton loginSuccessCallback={socialRegisterCallback} /> */}

      {/* <div data-cy="twitter-register" className="mt-6">
        <TwitterButton />
      </div> */}
    </>
  );
}
