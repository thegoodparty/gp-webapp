'use client';
import React, { useState } from 'react';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { passwordRegex, updateUser } from 'helpers/userHelper';
import { TfiLock } from 'react-icons/tfi';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Caption from '@shared/typography/Caption';
import PrimaryButton from '@shared/buttons/PrimaryButton';

const PASSWORD_REQUEST_FAILED = 'Password request failed';
const CURRENT_PASSWORD_INCORRECT = 'Current password is incorrect';
const PASSWORD_CHANGE_SUCCESS_MESSAGE = 'password successfully changed.';

function PasswordSection({ user: initUser }) {
  const [user, setUser] = useState(initUser);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordChangeSuccessful, setPasswordChangeSuccessful] =
    useState(false);

  const initialState = {
    oldPassword: '',
    password: '',
  };
  const [state, setState] = useState(initialState);

  const onChangeField = (key, val) => {
    setErrorMessage(null);
    setPasswordChangeSuccessful(false);
    setState({
      ...state,
      [key]: val,
    });
  };

  const fieldsValid =
    (user &&
      user.hasPassword &&
      state.password !== '' &&
      state.oldPassword !== '' &&
      // TODO: No check here for regex match because only length is checked in the API.
      //  https://github.com/thegoodparty/tgp-api/blob/develop/api/controllers/user/password/update.js#L7-L21
      //  We need to apply the same restrictions on passwords in the API as we do here in
      //  the UX.
      state.oldPassword.length > 7 &&
      state.password.match(passwordRegex) &&
      state.password.length > 7) ||
    (!user.hasPassword && state.password !== '' && state.password.length > 7);

  const reset = () => {
    setState(initialState);
  };

  const handleReqResult = async (result) => {
    if (result?.message === PASSWORD_CHANGE_SUCCESS_MESSAGE) {
      setErrorMessage(null);
      setPasswordChangeSuccessful(true);
      setUser(await updateUser());
      reset();
    } else if (result === false) {
      setPasswordChangeSuccessful(false);
      setErrorMessage(PASSWORD_REQUEST_FAILED);
    } else if (!result.ok) {
      const reason = await result.json();
      setPasswordChangeSuccessful(false);
      setErrorMessage(
        reason.message === 'incorrect password'
          ? CURRENT_PASSWORD_INCORRECT
          : reason.message,
      );
    }
  };

  const doPasswordChange = async () => {
    const { password, oldPassword } = state;
    setLoading(true);
    try {
      const result = await gpFetch(gpApi.user.changePassword, {
        newPassword: password,
        oldPassword,
      });
      await handleReqResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = () => {
    if (fieldsValid) {
      doPasswordChange(state.password, state.oldPassword);
    }
  };

  const defaultHelpText = `For security, passwords must have at least 1 capital letter, 1
    lowercase, 1 special character, 1 number, and 8 characters
    minimum`;

  const passwordChangeSuccessfulText =
    passwordChangeSuccessful &&
    `Password successfully ${user?.hasPassword ? 'changed' : 'created'}`;

  const helpText =
    errorMessage || passwordChangeSuccessfulText || defaultHelpText;

  return (
    <section className="py-4 border-b border-slate-300 flex">
      <div className="shrink-0 pr-3 text-indigo-600 pt-[6px]">
        <TfiLock />
      </div>
      <div className="flex-1">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <H4>Password</H4>
          <Body2 className="text-indigo-600 mb-6">
            {user?.hasPassword ? 'Change' : 'Create'} your password
          </Body2>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 lg:col-span-6">
              {user?.hasPassword && (
                <div className="mb-4">
                  <TextField
                    label="Old Password"
                    fullWidth
                    variant="outlined"
                    type="password"
                    value={state.oldPassword}
                    onChange={(e) => {
                      onChangeField('oldPassword', e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="col-span-12 lg:col-span-6 hidden lg:block">
              &nbsp;
            </div>
            <div className="col-span-12 lg:col-span-6">
              <TextField
                label="Password"
                fullWidth
                variant="outlined"
                value={state.password}
                type="password"
                onChange={(e) => {
                  onChangeField('password', e.target.value);
                }}
              />
            </div>
            <div className="col-span-12 lg:col-span-8 mt-4">
              <Caption
                className={`${errorMessage ? 'text-error' : ''}${
                  passwordChangeSuccessful ? 'text-success' : ''
                }`}
              >
                {helpText}
              </Caption>
            </div>
            <div className="col-span-12 lg:col-span-4 flex justify-end items-end">
              <div onClick={handleSavePassword}>
                <PrimaryButton
                  disabled={!fieldsValid}
                  type="submit"
                  size="medium"
                  loading={loading}
                >
                  Save
                </PrimaryButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PasswordSection;
