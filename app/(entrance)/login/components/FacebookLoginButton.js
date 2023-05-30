'use client';
import React, { useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';
import FacebookLogin from '@greatsumini/react-facebook-login';

const FacebookLoginButton = ({ loginSuccessCallback }) => {
  const [socialToken, setSocialToken] = React.useState('');
  const [socialEmail, setSocialEmail] = React.useState('');
  const [socialPicture, setSocialPicture] = React.useState('');

  useEffect(() => {
    if (socialToken != '' && socialEmail != '' && socialPicture != '') {
      const fbUser = {
        _provider: 'facebook',
        _token: { accessToken: socialToken },
        _profile: {
          email: socialEmail,
          profilePicURL: socialPicture,
        },
      };
      loginSuccessCallback(fbUser);
    }
  }, [socialToken, socialEmail, socialPicture]);

  return (
    <div data-cy="facebook-login" className="mt-6">
      <FacebookLogin
        appId="281110284260458"
        className={
          'rounded-lg py-5 px-1 relative text-center text-sm font-bold w-full'
        }
        style={{
          backgroundColor: '#507cc0',
          color: '#fff',
        }}
        data-cy={`facebook-social-login`}
        onSuccess={(response) => {
          if (response?.accessToken) {
            setSocialToken(response.accessToken);
          }
        }}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        onProfileSuccess={(response) => {
          if (response?.email) {
            setSocialEmail(response.email);
          }
          if (response?.picture?.data?.url) {
            setSocialPicture(response.picture.data.url);
          }
        }}
      >
        <div className="absolute left-2 top-3 p-1 w-4 h-4 flex items-center justify-center lg:left-3 lg:top-3 text-xs lg:w-8 lg:h-8">
          <FaFacebook size={30} />
        </div>
        CONTINUE WITH FACEBOOK
      </FacebookLogin>
    </div>
  );
};

export default FacebookLoginButton;
