'use client';
import { useState } from 'react';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import ForgotPasswordForm from './ForgotPasswordForm';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import { useSnackbar } from 'helpers/useSnackbar';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

async function sendForgotPasswordEmail(email) {
  try {
    const payload = {
      email,
    };
    await clientFetch(apiRoutes.authentication.forgotPassword, payload);
    return true;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export default function ForgotPasswordPage() {
  const [{ email, isValid }, setState] = useState({
    email: '',
    isValid: true,
  });
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const { successSnackbar, errorSnackbar } = useSnackbar();

  function handleEmailChange(email, isValid) {
    setState({ email, isValid });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isValid) {
      const res = await sendForgotPasswordEmail(email);

      if (res) {
        setForgotEmailSent(true);
        successSnackbar(`A password reset link was sent to ${email}`);
      } else {
        errorSnackbar('Error sending password reset link.');
      }
    }
  }

  return (
    <CardPageWrapper>
      {forgotEmailSent ? (
        <ForgotPasswordSuccess email={email} />
      ) : (
        <ForgotPasswordForm
          email={email}
          isValid={isValid}
          onEmailChange={handleEmailChange}
          onSubmit={handleSubmit}
        />
      )}
    </CardPageWrapper>
  );
}
