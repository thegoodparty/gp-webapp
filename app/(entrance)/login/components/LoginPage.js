'use client';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import {
  deleteCookie,
  getCookie,
  setCookie,
  setUserCookie,
} from 'helpers/cookieHelper.js';
import { useHookstate } from '@hookstate/core';
import { passwordRegex } from 'helpers/userHelper.js';
import Link from 'next/link.js';
import { Suspense, useState } from 'react';
import styles from './LoginPage.module.scss';
import { useRouter } from 'next/navigation.js';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile.js';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import SocialLoginButtons from './SocialLoginButtons';
import { createCampaign } from 'app/(company)/run-for-office/components/RunCampaignButton';
import YellowButtonClient from '@shared/buttons/YellowButtonClient';

async function login(email, password) {
  try {
    const api = gpApi.entrance.login;
    const payload = {
      email,
      password,
    };
    const { user, token } = await gpFetch(api, payload);
    if (user && token) {
      setUserCookie(user);
      setCookie('token', token);
      return user;
    }
    return false;
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

  const userState = useHookstate(globalUserState);
  const snackbarState = useHookstate(globalSnackbarState);
  const router = useRouter();

  const enableSubmit = () =>
    isValidEmail(state.email) &&
    state.password !== '' &&
    state.password.match(passwordRegex);

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const user = await login(state.email, state.password);
      if (user) {
        userState.set(() => user);
        const afterAction = getCookie('afterAction');
        if (afterAction === 'createCampaign') {
          await createCampaign(router);
        } else {
          const returnUrl = getCookie('returnUrl');
          if (returnUrl) {
            deleteCookie('returnUrl');
            router.push(returnUrl);
          } else {
            router.push('/');
          }
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
              <h1
                data-cy="register-title"
                className="text-2xl lg:text-4xl font-black"
              >
                Log into your account
              </h1>
            </div>
            <div className="flex justify-center">
              <div
                className="mb-10 mt-6 flex rounded-xl bg-zinc-100 items-center justify-center"
                data-cy="register-label"
              >
                <Link
                  href="/register"
                  data-cy="redirect-to-login"
                  className=" no-underline"
                >
                  <div className="transition text-neutral-400 py-3 px-6 rounded-xl hover:text-black">
                    Sign up
                  </div>
                </Link>
                <div className="bg-black text-white py-3 px-6 rounded-xl">
                  Sign In
                </div>
              </div>
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
              <div className="flex mt-5">
                <YellowButtonClient
                  style={{ width: '100%' }}
                  disabled={!enableSubmit()}
                  onClick={handleSubmit}
                  type="submit"
                >
                  <strong>LOGIN</strong>
                </YellowButtonClient>
              </div>
            </form>
            <div className="flex mt-5">
              <Link href="/forgot-password" className="text-sm">
                Forgot your password?
              </Link>
            </div>

            <Suspense>
              <SocialLoginButtons />
            </Suspense>
          </div>
        </div>
      </MaxWidth>
    </>
  );
}
