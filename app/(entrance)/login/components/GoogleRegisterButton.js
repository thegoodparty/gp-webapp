'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleRegisterButton = ({ loginSuccessCallback }) => {
  const performGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // console.log(tokenResponse);
      const accessToken = tokenResponse.access_token;
      // console.log('accessToken', accessToken);
      const socialUser = await fetchGoogleUser(accessToken);
      // console.log('socialUser', socialUser);
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
    // console.log('userdata', data);

    const socialUser = {
      _profile: {
        name: data.name,
        id: data.id,
        email: data.email,
        profilePicURL: data.picture,
      },
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
        className={'rounded-lg py-5 px-1 relative text-center'}
        style={{
          backgroundColor: '#fff',
          border: 'solid 2px #484E55',
        }}
        data-cy={`google-social-login`}
      >
        <div className="text-xs lg:text-sm bg-white text-black relative  py-4 px-1 w-full flex items-center justify-center">
          <div className="lg:text-lg mr-2">
            <FcGoogle />
          </div>
          <div className="font-bold">Google</div>
        </div>
      </Button>
    </div>
  );
};

export default GoogleRegisterButton;
