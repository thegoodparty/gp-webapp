'use client';

import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import gpApi from 'gpApi/index.js';
import gpFetch from 'gpApi/gpFetch.js';
import ResetPasswordForm from './ResetPasswordForm';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import saveToken from 'helpers/saveToken';
import { setUserCookie } from 'helpers/cookieHelper';
import { useUser } from '@shared/hooks/useUser';

async function setPasswordApi(email, password, token) {
  try {
    const payload = {
      email,
      password,
      token,
      adminCreate: true,
    };
    return await gpFetch(gpApi.entrance.resetPassword, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SetPasswordPage({ email, token }) {
  const [_, setUser] = useUser();
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
      const res = await setPasswordApi(email, password, token);
      const { user, token: userToken } = res || {};

      if (user && userToken) {
        await saveToken(userToken);
        setUserCookie(user);
        setUser(user);
        window.location.href = '/dashboard';
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Error saving password.',
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
          createMode
        />
      )}
    </CardPageWrapper>
  );
}
