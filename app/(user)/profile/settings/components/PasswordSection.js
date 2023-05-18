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
import { globalUserState } from '@shared/layouts/navigation/ClientRegisterOrProfile';
import PortalPanel from '@shared/layouts/PortalPanel';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { passwordRegex } from 'helpers/userHelper';
import { setUserCookie } from 'helpers/cookieHelper';

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
    <section>
      <PortalPanel color="#CA2CCD">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <h3
            className="text-[22px] tracking-wide font-black mb-16"
            data-cy="settings-title"
          >
            {user.hasPassword ? 'Change' : 'Create'} your password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {user.hasPassword && (
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
              <div className="mb-4">
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
              <small>
                For security, passwords must have at least 1 capital letter, 1
                lowercase, 1 special character or number, and 8 characters
                minimum
              </small>
              <br />

              <div className="row mt-20">
                <BlackButtonClient
                  disabled={!canSave()}
                  onClick={handleSavePassword}
                  type="submit"
                >
                  <div className="py-0 px-6 font-black">Save</div>
                </BlackButtonClient>
                <div onClick={reset} className="ml-5 underline cursor-pointer">
                  cancel
                </div>
              </div>
            </div>
          </div>
        </form>
      </PortalPanel>
    </section>
  );
}

export default PasswordSection;
