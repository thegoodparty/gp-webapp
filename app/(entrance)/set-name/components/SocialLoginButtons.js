'use client';
import { deleteCookie, getCookie } from 'helpers/cookieHelper';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useUser } from '@shared/hooks/useUser';
import Overline from '@shared/typography/Overline';
import saveToken from 'helpers/saveToken';
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus';
import { useSnackbar } from 'helpers/useSnackbar';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

async function login(payload) {
  try {
    const resp = await clientFetch(
      apiRoutes.authentication.socialLogin,
      payload,
    );
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SocialLoginButtons() {
  const { successSnackbar, errorSnackbar } = useSnackbar();
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
      await saveToken(token);
      setUser(user);
      successSnackbar('Welcome back to GoodParty.org!');
      const returnCookie = getCookie('returnUrl');
      if (returnCookie) {
        deleteCookie('returnUrl');
        router.push(returnCookie);
      } else {
        const status = await fetchCampaignStatus();

        if (status?.status === 'candidate') {
          window.location.href = '/dashboard';
          return;
        }
        if (status?.status === 'volunteer') {
          window.location.href = '/volunteer-dashboard';
          return;
        }
        window.location.href = '/';
      }
    } else {
      errorSnackbar('Error [loginType] in');
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
    </>
  );
}
