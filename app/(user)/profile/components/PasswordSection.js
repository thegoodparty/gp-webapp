'use client';
/**
 *
 * PasswordSection
 *
 */

import React, { useState } from 'react';
import TextField from '@shared/inputs/TextField';
import Grid from '@mui/material/Grid';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/ProfileDropdown';
import PortalPanel from '@shared/layouts/PortalPanel';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { passwordRegex } from 'helpers/userHelper';
import { setUserCookie } from 'helpers/cookieHelper';
import { TfiLock } from 'react-icons/tfi';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Caption from '@shared/typography/Caption';
import PrimaryButton from '@shared/buttons/PrimaryButton';

async function changePasswordCallback(password, oldPassword) {
  try {
    // yield put(snackbarActions.showSnakbarAction('Saving...'));
    const api = gpApi.user.changePassword;
    const payload = {
      newPassword: password,
      oldPassword,
    };
    const response = await gpFetch(api, payload, 3600);
    const { user } = response;
    setUserCookie(user);
    // yield put(snackbarActions.showSnakbarAction('Your new password is saved'));
    // const random = parseInt(Math.random() * 1000 + '', 10);
    // yield put(push(`?save=${random}`)); // force a refresh
  } catch (error) {
    console.log('error', error);
    // if (error.response?.incorrect) {
    //     yield put(
    //         snackbarActions.showSnakbarAction(
    //             'Current Password is incorrect',
    //             'error',
    //         ),
    //     );
    //     logEvent('change-password', 'error - incorrect password');
    //     yield put(
    //         globalActions.logErrorAction(
    //             'change password - incorrect password',
    //             error,
    //         ),
    //     );
    // } else {
    //     yield put(
    //         snackbarActions.showSnakbarAction(
    //             'Error changing your password.',
    //             'error',
    //         ),
    //     );
    //     logEvent('change-password', 'error');
    // }
  }
}
function PasswordSection() {
  const userState = useHookstate(globalUserState);
  const user = userState.get();

  const initialState = {
    oldPassword: '',
    password: '',
  };
  const [state, setState] = useState(initialState);

  const onChangeField = (key, val) => {
    setState({
      ...state,
      [key]: val,
    });
  };

  const canSave = () => {
    if (
      user &&
      user.hasPassword &&
      state.password !== '' &&
      state.oldPassword !== '' &&
      state.password.match(passwordRegex) &&
      state.password.length > 7
    ) {
      return true;
    }
    if (
      !user.hasPassword &&
      state.password !== '' &&
      state.password.length > 7
    ) {
      return true;
    }
    return false;
  };

  const reset = () => {
    setState(initialState);
  };

  const handleSavePassword = () => {
    if (canSave()) {
      changePasswordCallback(state.password, state.oldPassword);
      reset();
    }
  };

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
              <Caption>
                For security, passwords must have at least 1 capital letter, 1
                lowercase, 1 special character, 1 number, and 8 characters
                minimum
              </Caption>
            </div>
            <div className="col-span-12 lg:col-span-4 flex justify-end items-end">
              <div onClick={handleSavePassword}>
                <PrimaryButton
                  disabled={!canSave()}
                  type="submit"
                  size="medium"
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
