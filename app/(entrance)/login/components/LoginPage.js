'use client';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import {
  deleteCookie,
  getCookie,
  setUserCookie,
} from 'helpers/cookieHelper.js';
import { useHookstate } from '@hookstate/core';
import Link from 'next/link.js';
import { Suspense, useState } from 'react';
import styles from './LoginPage.module.scss';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import SocialRegisterButtons from './SocialRegisterButtons';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { isValidPassword } from '@shared/inputs/IsValidPassword';
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus';
import { useUser } from '@shared/hooks/useUser';

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
      const { user, newUser } = await login(state.email, state.password);

      if (user) {
        setUserCookie(user);
        setUser(user);
        if (newUser) {
          const afterAction = getCookie('afterAction');
          if (
            (user.firstName && user.firstName !== '') ||
            afterAction === 'createCampaign'
          ) {
            await createCampaign();
            return;
          }
          if (user.firstName === '' || !user.firstName) {
            window.location.href = '/set-name';
            return;
          }
        } else {
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
        }
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
    <>
      <MaxWidth>
        <div className={`flex items-center justify-center ${styles.wrapper}`}>
          <div className="grid py-6 max-w-lg w-[75vw]">
            <div className="text-center mb-8 pt-8">
              <H1>Access free campaign tools</H1>
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
                  onChangeCallback={(e) =>
                    onChangeField(e.target.value, 'email')
                  }
                  value={state.email}
                />
              </div>

              <div className="flex mt-5">
                <PasswordInput
                  label="Password"
                  onChangeCallback={(pwd) => onChangeField(pwd, 'password')}
                />
              </div>
              <div className="flex justify-center mt-12" onClick={handleSubmit}>
                <PrimaryButton disabled={!enableSubmit()} type="submit">
                  <strong>Continue with email</strong>
                </PrimaryButton>
              </div>
            </form>
            <div className="mt-5 text-center">
              <Link href="/forgot-password" className="text-sm underline">
                Forgot your password?
              </Link>
            </div>

            <Suspense>
              <SocialRegisterButtons />
            </Suspense>
          </div>
        </div>
      </MaxWidth>
    </>
  );
}
