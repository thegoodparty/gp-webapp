'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

const GoogleButton = ({ onLoginSuccess }) => {
  const performGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      const accessToken = tokenResponse.access_token;
      console.log('accessToken', accessToken);
      fetchGoogleUser(accessToken);
    },
  });

  const fetchGoogleUser = async (accessToken) => {
    console.log('fetching...');
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    console.log('userdata', data);
    return data;
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

export default GoogleButton;
