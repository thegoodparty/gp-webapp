'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getCookie, setUserCookie } from 'helpers/cookieHelper';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import { useRouter } from 'next/navigation';
import TwitterButton from './TwitterButton';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useUser } from '@shared/hooks/useUser';
import Overline from '@shared/typography/Overline';
import saveToken from 'helpers/saveToken';

async function login(payload) {
  try {
    const api = gpApi.entrance.socialLogin;
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SocialLoginButtons() {
  const snackbarState = useHookstate(globalSnackbarState);
  const [_, setUser] = useUser();
  const router = useRouter();

  const socialLoginCallback = async (socialUser) => {
    const profile = socialUser._profile;
    const provider = socialUser._provider;
    const { email, profilePicURL } = profile;
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
      // for google removing the "=s96-c" at the end of the string returns a large image.
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
      email,
      socialPic,
      socialProvider: provider,
      socialToken: idToken,
    };

    const { user, token } = await login(payload);
    if (user) {
      setUser(user);
      saveToken(token);
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Welcome back to GoodParty.org!',
          isError: false,
        };
      });
      const returnCookie = getCookie('returnUrl');
      if (returnCookie) {
        deleteCookie('returnUrl');
        router.push(returnCookie);
      } else {
        router.push('/');
      }
      window.location.href = '/';
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error [loginType] in',
          isError: true,
        };
      });
    }
  };

  return (
    <>
      <div className="my-4 h-4 relative">
        <div className="border-b border-neutral-200 h-4" />
        <div className="absolute w-full text-center top-1  ">
          <Overline className="bg-white inline-block px-3">
            OR CONTINUE WITH
          </Overline>
        </div>
      </div>

      <GoogleOAuthProvider clientId="28351607421-c9m6ig3vmto6hpke4g96ukgfl3vvko7g.apps.googleusercontent.com">
        <GoogleLoginButton loginSuccessCallback={socialLoginCallback} />
      </GoogleOAuthProvider>

      <FacebookLoginButton loginSuccessCallback={socialLoginCallback} />
    </>
  );
}
