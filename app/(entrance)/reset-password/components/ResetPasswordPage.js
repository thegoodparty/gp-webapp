'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import { useHookstate } from '@hookstate/core';
import { useState } from 'react';
import styles from '../../login/components/LoginPage.module.scss';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import { passwordRegex } from 'helpers/userHelper';
import { useRouter } from 'next/navigation';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import H1 from '@shared/typography/H1';
import { isValidEmail } from '@shared/inputs/EmailInput';

async function resetPassword(email, password, token) {
  try {
    const payload = {
      email,
      password,
      token,
    };
    await gpFetch(gpApi.entrance.resetPassword, payload);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function ResetPasswordPage({ email, token }) {
  const [state, setState] = useState({
    password: '',
  });
  const snackbarState = useHookstate(globalSnackbarState);
  const router = useRouter();
  if (!isValidEmail(email)) {
    router.push('/login');
  }

  const enableSubmit = () =>
    state.password !== '' && state.password.match(passwordRegex);

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const res = await resetPassword(email, state.password, token);
      if (res) {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: `Your password has been updated`,
            isError: false,
          };
        });
        router.push('/login');
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

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <CardPageWrapper>
      <div className={`flex items-center justify-center `}>
        <div className="py-6 max-w-2xl grid" style={{ width: '75vw' }}>
          <div className="text-center mb-8 pt-8">
            <H1>Enter a new password for {email}</H1>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
            }}
            data-cy="reset-password-form"
            id="reset-password-form"
          >
            <PasswordInput
              onChangeCallback={(pwd) => onChangeField('password', pwd)}
              value={state.password}
            />

            <br />
            <br />

            <BlackButtonClient
              style={{ width: '100%' }}
              disabled={!enableSubmit()}
              onClick={handleSubmit}
              type="submit"
            >
              <strong>CHANGE PASSWORD</strong>
            </BlackButtonClient>
          </form>
        </div>
      </div>
    </CardPageWrapper>
  );
}
