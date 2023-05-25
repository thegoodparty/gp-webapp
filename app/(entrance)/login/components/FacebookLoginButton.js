'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { FaFacebook } from 'react-icons/fa';
import FacebookLogin from '@greatsumini/react-facebook-login';

const FacebookLoginButton = ({ loginSuccessCallback }) => {
  //   const performFacebookLogin = useFacebookLogin({
  //     onSuccess: async (tokenResponse) => {
  //       const accessToken = tokenResponse.access_token;
  //       const socialUser = await fetchFacebookUser(accessToken);
  //       loginSuccessCallback(socialUser);
  //     },
  //   });
  const [socialUser, setSocialUser] = React.useState({});

  return (
    <div data-cy="facebook-login" className="mt-6">
      <FacebookLogin
        appId="281110284260458"
        className={'rounded-lg py-4 px-1 relative text-center w-full'}
        style={{
          backgroundColor: '#507cc0',
          color: '#fff',
        }}
        data-cy={`facebook-social-login`}
        onSuccess={(response) => {
          console.log('Login Success!', response);
          const fbUser = {
            _provider: 'facebook',
            _token: { accessToken: response.accessToken },
          };
          console.log('fbUser', fbUser);
          setSocialUser(fbUser);
        }}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        onProfileSuccess={(response) => {
          console.log('Get Profile Success!', response);
          let fbUser = socialUser;
          fbUser._profile = {
            email: response.email,
            profilePicURL: response.picture.data.url,
          };
          console.log('fbUser', fbUser);
          setSocialUser(fbUser);
          loginSuccessCallback(fbUser);
        }}
      >
        <div className="absolute left-2 top-3 p-1 w-4 h-4 flex items-center justify-center lg:left-3 lg:top-3 text-2xl lg:w-8 lg:h-8">
          <FaFacebook size={30} />
        </div>
        CONTINUE WITH FACEBOOK
      </FacebookLogin>
    </div>
  );
};

export default FacebookLoginButton;
