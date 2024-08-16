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
import Paper from '@shared/utils/Paper';
import H2 from '@shared/typography/H2';
import PasswordInput from '@shared/inputs/PasswrodInput';
import DeleteAccountButton from './DeleteAccountButton';

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

  return (
    <Paper className="mt-4">
      <H2>Password</H2>
      <Body2 className="text-gray-600 mb-8">
        Update your password and manage account.
      </Body2>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <H4>Password</H4>
        <Body2 className="text-indigo-600 mb-6">
          {user?.hasPassword ? 'Change' : 'Create'} your password
        </Body2>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6">
            {user?.hasPassword && (
              <div className="mb-4">
                <PasswordInput
                  onChangeCallback={(pwd) => {
                    onChangeField('oldPassword', pwd);
                  }}
                  label="Old Password"
                  helperText=""
                />
              </div>
            )}
          </div>
          <div className="col-span-12 lg:col-span-6 hidden lg:block">
            &nbsp;
          </div>
          <div className="col-span-12 lg:col-span-6">
            <PasswordInput
              onChangeCallback={(pwd) => {
                onChangeField('password', pwd);
              }}
              label="New Password"
            />
          </div>

          <div className="col-span-12 lg:col-span-6 hidden lg:block">
            &nbsp;
          </div>

          <div className="col-span-12 ">&nbsp;</div>

          <div className="col-span-12 lg:col-span-6">
            <div>
              <PrimaryButton
                disabled={!fieldsValid}
                type="submit"
                loading={loading}
                onClick={handleSavePassword}
              >
                Save Changes
              </PrimaryButton>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="flex justify-end">
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </form>
    </Paper>
  );
}

export default PasswordSection;
