'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient.js';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import { setCookie, setUserCookie } from 'helpers/cookieHelper.js';
import { useHookstate } from '@hookstate/core';
import Link from 'next/link.js';
import { useState } from 'react';
import styles from '../../login/components/LoginPage.module.scss';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';

async function retrievePassword(email) {
  try {
    const payload = {
      email,
    };
    await gpFetch(gpApi.entrance.forgotPassword, payload);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function ForgotPasswordPage() {
  const [state, setState] = useState({
    email: '',
    forgotSent: false,
  });
  const snackbarState = useHookstate(globalSnackbarState);

  const enableSubmit = () => isValidEmail(state.email);

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const res = await retrievePassword(state.email);
      if (res) {
        onChangeField(true, 'forgotSent');
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: `A password reset link was sent to ${state.email}`,
            isError: false,
          };
        });
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Error sending password reset link.',
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
    <MaxWidth>
      <div className={`flex items-center justify-center ${styles.wrapper}`}>
        <div className="py-6 max-w-2xl grid" style={{ width: '75vw' }}>
          <div className="text-center mb-8 pt-8">
            <h1
              data-cy="register-title"
              className="text-2xl lg:text-4xl font-black"
            >
              Forgot Password?
            </h1>
          </div>

          {state.forgotSent ? (
            <div className="text-2xl font-black my-6 p-4 border border-black rounded text-center">
              Your password recovery link was sent to {state.email}
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
              }}
              data-cy="email-form"
              id="register-page-form"
            >
              <EmailInput
                onChangeCallback={(e) => onChangeField(e.target.value, 'email')}
                value={state.email}
              />

              <br />
              <br />

              <BlackButtonClient
                style={{ width: '100%' }}
                disabled={!enableSubmit()}
                onClick={handleSubmit}
                type="submit"
              >
                <strong>SEND CODE</strong>
              </BlackButtonClient>
            </form>
          )}
          <br />
          <br />

          <Link href="/login" className="text-sm">
            Back to login
          </Link>
        </div>
      </div>
    </MaxWidth>
  );
}
