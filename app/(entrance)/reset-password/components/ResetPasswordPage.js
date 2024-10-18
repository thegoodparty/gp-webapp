'use client';
import { useState } from 'react';
import gpApi from 'gpApi/index.js';
import gpFetch from 'gpApi/gpFetch.js';
import ResetPasswordForm from './ResetPasswordForm';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import { useSnackbar } from 'helpers/useSnackbar';

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
  const [{ value: password, isValid }, setPassword] = useState({
    value: '',
    isValid: true,
  });
  const [{ value: confirmPassword, isMatch }, setConfirmPassword] = useState({
    value: '',
    isMatch: true,
  });
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const { successSnackbar, errorSnackbar } = useSnackbar();

  function handlePasswordChange(newPwd, pwdValid) {
    setPassword({
      value: newPwd,
      isValid: pwdValid,
    });

    setConfirmPassword((state) => ({
      ...state,
      isMatch: state.value === newPwd,
    }));
  }

  function handleConfirmChange(newConfirmPwd) {
    setConfirmPassword({
      value: newConfirmPwd,
      isMatch: password === newConfirmPwd,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isValid) {
      const res = await resetPassword(email, password, token);

      if (res) {
        setResetSuccessful(true);
        successSnackbar(`Your password has been updated`);
      } else {
        errorSnackbar(`Error updating password`);
      }
    }
  }

  return (
    <CardPageWrapper>
      {resetSuccessful ? (
        <ResetPasswordSuccess />
      ) : (
        <ResetPasswordForm
          password={password}
          confirmPassword={confirmPassword}
          isValid={isValid}
          isMatch={isMatch}
          onSubmit={handleSubmit}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmChange}
        />
      )}
    </CardPageWrapper>
  );
}
