'use client';

import { useState, useMemo } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import { isValidPassword } from '@shared/inputs/IsValidPassword';
import gpApi from 'gpApi/index.js';
import gpFetch from 'gpApi/gpFetch.js';
import ResetPasswordForm from './ResetPasswordForm';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import ResetPasswordSuccess from './ResetPasswordSuccess';

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
  const snackbarState = useHookstate(globalSnackbarState);

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

        snackbarState.set(() => {
          return {
            isOpen: true,
            message: `Your password has been updated`,
            isError: false,
          };
        });
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Error updating password.',
            isError: true,
          };
        });
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
