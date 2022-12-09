'use client';
import React from 'react';
import SocialLogin from 'react-social-login';
import Button from '@mui/material/Button';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const SocialButton = ({ triggerLogin, children, channel, ...props }) => {
  const icon = () => {
    if (channel === 'facebook') {
      return (
        <div className="absolute left-2 top-3 p-1 w-4 h-4 flex items-center justify-center lg:left-3 lg:top-3 text-2xl lg:w-8 lg:h-8">
          <FaFacebook size={30} />
        </div>
      );
    }
    if (channel === 'google') {
      return (
        <div className="absolute left-2 top-3 p-1 w-4 h-4 flex items-center justify-center lg:left-3 lg:top-3 text-2xl lg:w-8 lg:h-8 bg-white shadow-sm rounded-full">
          <FcGoogle size={30} />
        </div>
      );
    }
    return <></>;
  };

  return (
    <Button
      fullWidth
      onClick={triggerLogin}
      {...props}
      className={'rounded-lg py-4 px-1 relative text-center'}
      style={
        channel === 'facebook'
          ? { backgroundColor: '#507cc0', color: '#fff' }
          : channel === 'google'
          ? {
              backgroundColor: '#fff',
              boxShadow: '0 0 3px 3px rgba(0, 0, 0, 0.1)',
            }
          : {}
      }
      data-cy={`${channel}-social-login`}
    >
      <div className="text-center font-black py-3">
        {icon()} {children}
      </div>
    </Button>
  );
};

export default SocialLogin(SocialButton);
