'use client';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import gpApi from 'gpApi/index.js';
import {
  deleteCookie,
  getCookie,
  setUserCookie,
} from 'helpers/cookieHelper.js';
import { useHookstate } from '@hookstate/core';
import Link from 'next/link.js';
import { Suspense, useState } from 'react';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { isValidPassword } from '@shared/inputs/IsValidPassword';
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus';
import { useUser } from '@shared/hooks/useUser';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import Body2 from '@shared/typography/Body2';
import SocialLoginButtons from 'app/(entrance)/set-name/components/SocialLoginButtons';
import saveToken from 'helpers/saveToken';

export const validateZip = (zip) => {
  const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return validZip.test(zip);
};

async function login(email, password) {
  try {
    const api = gpApi.entrance.login;
    const payload = {
      email,
      password,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function LoginPage() {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const [_, setUser] = useUser();

  const snackbarState = useHookstate(globalSnackbarState);

  const enableSubmit = () =>
    isValidEmail(state.email) && isValidPassword(state.password);

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const { user, token } = await login(state.email, state.password);

      if (user) {
        await saveToken(token);
        setUserCookie(user);
        setUser(user);

        const returnUrl = getCookie('returnUrl');
        if (returnUrl) {
          deleteCookie('returnUrl');
          window.location.href = returnUrl;
          return;
        }

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
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'The email or password are wrong.',
            isError: true,
          };
        });
      }
    }
  };

  const onChangeField = (value, key) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <CardPageWrapper>
      <div className={`flex items-center justify-center `}>
        <div className="grid max-w-lg w-[75vw]">
          <div className="text-center mb-4">
            <H1>Login to GoodParty.org</H1>
            <Body2 className="mt-3">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="underline text-info">
                Create an account
              </Link>
            </Body2>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
            }}
            data-cy="email-form"
            id="register-page-form"
          >
            <div className="flex mt-5">
              <EmailInput
                onChangeCallback={(e) => onChangeField(e.target.value, 'email')}
                value={state.email}
                shrink
                placeholder="hello@email.com"
              />
            </div>

            <div className="flex mt-5">
              <PasswordInput
                label="Password"
                onChangeCallback={(pwd) => onChangeField(pwd, 'password')}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="please don't use your dogs name"
              />
            </div>
            <div className="flex justify-center mt-12" onClick={handleSubmit}>
              <PrimaryButton disabled={!enableSubmit()} type="submit" fullWidth>
                Login
              </PrimaryButton>
            </div>
          </form>
          <div className="mt-5 text-center">
            <Link href="/forgot-password" className="text-sm underline">
              Forgot your password?
            </Link>
          </div>

          <Suspense>
            <SocialLoginButtons />
          </Suspense>
        </div>
      </div>
    </CardPageWrapper>
  );
}
