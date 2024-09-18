'use client';

import { useMemo, useState } from 'react';
import { useHookstate } from '@hookstate/core';
import gpApi from 'gpApi/index.js';
import gpFetch from 'gpApi/gpFetch.js';
import { isValidEmail } from 'helpers/validations';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import ForgotPassowordForm from './ForgotPasswordForm';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';

async function sendForgotPasswordEmail(email) {
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
  const [email, setEmail] = useState('');
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);
  const isValid = useMemo(() => isValidEmail(email), [email]);
  const showError = email !== '' && !isValid;

  async function handleSubmit(e) {
    e.preventDefault();

    if (isValid) {
      const res = await sendForgotPasswordEmail(email);

      if (res) {
        setForgotEmailSent(true);

        snackbarState.set(() => {
          return {
            isOpen: true,
            message: `A password reset link was sent to ${email}`,
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
  }

  return (
    <CardPageWrapper>
      {forgotEmailSent ? (
        <ForgotPasswordSuccess email={email} />
      ) : (
        <ForgotPassowordForm
          email={email}
          isValid={isValid}
          showError={showError}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
        />
      )}
    </CardPageWrapper>
  );
}
