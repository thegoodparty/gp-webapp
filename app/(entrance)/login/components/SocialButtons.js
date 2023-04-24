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
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
// import SocialButton from 'app/(entrance)/register/components/SocialButton';
import TwitterButton from './TwitterButton';
import { createCampaign } from 'app/(company)/run-for-office/components/RunCampaignButton';

async function login(payload) {
  try {
    const api = gpApi.entrance.socialLogin;
    const { user, token } = await gpFetch(api, payload);
    if (user && token) {
      setUserCookie(user);
      setCookie('token', token);
    }

    return user;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SocialButtons() {
  const snackbarState = useHookstate(globalSnackbarState);
  const userState = useHookstate(globalUserState);
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
        const largeImage = await fetch(window.FB.api, '/me/picture?width=500');
        socialPic = largeImage || '';
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
      email,
      socialPic,
      socialProvider: provider,
      socialToken: idToken,
    };
    const user = await login(payload);
    if (user) {
      userState.set(() => user);
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Welcome back to Good Party!',
          isError: false,
        };
      });
      const afterAction = getCookie('afterAction');
      if (afterAction === 'createCampaign') {
        await createCampaign(router);
      }
      const returnCookie = getCookie('returnUrl');
      if (returnCookie) {
        deleteCookie('returnUrl');
        router.push(returnCookie);
      } else {
        router.push('/');
      }
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error login in',
          isError: true,
        };
      });
    }
  };
  const socialLoginFailureCallback = () => {};
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

      {/* <div data-cy="facebook-login">
        <SocialButton
          channel="facebook"
          provider="facebook"
          appId="241239336921963"
          onLoginSuccess={socialLoginCallback}
          onLoginFailure={socialLoginFailureCallback}
        >
          Continue with FACEBOOK
        </SocialButton>
      </div>
      <div data-cy="google-login" className="mt-6">
        <SocialButton
          channel="google"
          provider="google"
          appId="28351607421-c9m6ig3vmto6hpke4g96ukgfl3vvko7g.apps.googleusercontent.com"
          onLoginSuccess={socialLoginCallback}
          onLoginFailure={socialLoginFailureCallback}
        >
          Continue with GOOGLE
        </SocialButton>
      </div> */}

      <div data-cy="twitter-login" className="mt-6">
        <TwitterButton />
      </div>
    </>
  );
}
