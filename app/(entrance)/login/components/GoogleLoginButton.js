'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ loginSuccessCallback }) => {
  const performGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      const socialUser = await fetchGoogleUser(accessToken);
      loginSuccessCallback(socialUser);
    },
  });

  const fetchGoogleUser = async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();

    const socialUser = {
      _profile: { email: data.email, profilePicURL: data.picture },
      _provider: 'google',
      _token: { idToken: accessToken },
    };
    return socialUser;
  };

  return (
    <div data-cy="google-login" className="mt-6">
      <Button
        fullWidth
        onClick={performGoogleLogin}
        className={'rounded-lg py-4 px-1 relative text-center'}
        style={{
          backgroundColor: '#fff',
          border: 'solid 2px #000',
        }}
        data-cy={`google-social-login`}
      >
        <div className="text-center text-black py-3">
          <div className="absolute left-2 top-3 p-1 w-4 h-4 flex items-center justify-center lg:left-3 lg:top-3 text-2xl lg:w-8 lg:h-8 bg-white shadow-sm rounded-full">
            <FcGoogle size={30} />
          </div>
        </div>
        Continue with GOOGLE
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
