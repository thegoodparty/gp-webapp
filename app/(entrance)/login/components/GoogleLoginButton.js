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
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          // border color grey for google button
          border: '1px solid #ccc',
        }}
        data-cy={`google-social-login`}
      >
        <div className="text-xs lg:text-sm bg-white text-black relative  py-4 px-1 w-full">
          <span className="absolute left-3 t-4 lg:text-xl">
            <FcGoogle />
          </span>
          <div className="font-bold">Google</div>
        </div>
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
