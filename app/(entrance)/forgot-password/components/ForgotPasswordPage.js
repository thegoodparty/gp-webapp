'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient.js';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import { useHookstate } from '@hookstate/core';
import Link from 'next/link.js';
import { useState } from 'react';
import styles from '../../login/components/LoginPage.module.scss';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';

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
    <CardPageWrapper>
      <div className={`flex items-center justify-center`}>
        <div className="max-w-2xl grid" style={{ width: '75vw' }}>
          <div className="text-center mb-8 pt-8">
            <H1 data-cy="register-title">Forgot Password?</H1>
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

              <PrimaryButton
                fullWidth
                disabled={!enableSubmit()}
                onClick={handleSubmit}
                type="submit"
              >
                Send Recovery Email
              </PrimaryButton>
            </form>
          )}
          <br />
          <br />

          <Link href="/login" className="text-sm">
            Back to login
          </Link>
        </div>
      </div>
    </CardPageWrapper>
  );
}
