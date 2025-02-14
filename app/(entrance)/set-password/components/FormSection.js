'use client';
import { useState } from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import saveToken from 'helpers/saveToken';
import { setUserCookie } from 'helpers/cookieHelper';
import { useUser } from '@shared/hooks/useUser';
import { useSnackbar } from 'helpers/useSnackbar';
import Paper from '@shared/utils/Paper';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

async function setPasswordApi(email, password, token) {
  try {
    const payload = {
      email,
      password,
      token,
      adminCreate: true,
    };
    const resp = await clientFetch(
      apiRoutes.authentication.resetPassword,
      payload,
    );
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function FormSection({ email, token }) {
  const [_, setUser] = useUser();
  const [{ value: password, isValid }, setPassword] = useState({
    value: '',
    isValid: true,
  });
  const [{ value: confirmPassword, isMatch }, setConfirmPassword] = useState({
    value: '',
    isMatch: true,
  });
  const [resetSuccessful, setResetSuccesful] = useState(false);
  const { errorSnackbar, successSnackbar } = useSnackbar();

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
      } else if (res.ok === false) {
        const { message } = await res.json();
        errorSnackbar('Error saving password: ' + message);
      } else {
        successSnackbar('Password updated successfully.');
        setResetSuccesful(true);
      }
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="grid py-6 max-w-2xl w-[85vw]">
        <Paper>
          <div className="p-4 md:p-6 lg:p-8">
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
          </div>
        </Paper>
      </div>
    </div>
  );
}
