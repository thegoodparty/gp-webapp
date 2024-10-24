'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getCookie } from 'helpers/cookieHelper';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import GoogleRegisterButton from './GoogleRegisterButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useUser } from '@shared/hooks/useUser';
import Overline from '@shared/typography/Overline';
import saveToken from 'helpers/saveToken';

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
  const { successSnackbar, errorSnackbar } = useSnackbar();
  const [_, setUser] = useUser();

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
    const { user, newUser, token } = await register(payload);

    if (user) {
      successSnackbar(`Welcome ${newUser ? '' : 'back'} to GoodParty.org!`);
      await saveToken(token);
      setUser(user);

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

      window.location.href = '/';
    } else {
      errorSnackbar('Error registering');
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
        <GoogleRegisterButton loginSuccessCallback={socialRegisterCallback} />
      </GoogleOAuthProvider>
    </>
  );
}
