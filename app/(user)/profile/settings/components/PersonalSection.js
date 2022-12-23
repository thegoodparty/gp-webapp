'use client';
/**
 *
 * PersonalSection
 *
 */

import React, { useState, useEffect, Fragment } from 'react';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import PortalPanel from '@shared/layouts/PortalPanel';
import { isValidEmail } from '@shared/inputs/EmailInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PhoneInput from '@shared/inputs/PhoneInput';
import styles from './PersonalSection.module.scss';
import { setUserCookie } from 'helpers/cookieHelper';

async function updateUserCallback(updatedFields, userState) {
  try {
    //   yield put(snackbarActions.showSnakbarAction('Saving...'));
    const api = gpApi.user.updateUser;
    const payload = {
      ...updatedFields,
    };

    const response = await gpFetch(api, payload, 3600);
    const { user } = response;
    userState.set(() => user);
    setUserCookie(user);
    //   yield put(snackbarActions.showSnakbarAction('Your Profile is updated'));
  } catch (error) {
    console.log('Error updating user', error);
    //   yield put(
    //     snackbarActions.showSnakbarAction('Error updating your profile', 'error'),
    //   );
  }
}
export const USER_SETTING_FIELDS = [
  {
    key: 'name',
    label: 'Name',
    initialValue: '',
    maxLength: 20,
    required: true,
  },
  {
    key: 'email',
    label: 'Email',
    initialValue: '',
    maxLength: 20,
    type: 'email',
  },
  {
    key: 'phone',
    label: 'Mobile Number',
    initialValue: '',
    maxLength: 12,
    type: 'phone',
  },
  {
    key: 'zip',
    label: 'Zip Code',
    initialValue: '',
    maxLength: 5,
    required: true,
  },
  {
    key: 'displayName',
    label: 'Display Name',
    initialValue: '',
    maxLength: 16,
  },
  // { key: 'pronouns', label: 'Preferred Pronouns', initialValue: '' },
];

function PersonalSection() {
  const userState = useHookstate(globalUserState);
  const user = userState.get('user');
  const updatedState = {};
  if (user) {
    USER_SETTING_FIELDS.forEach((field) => {
      updatedState[field.key] = user[field.key] || field.initialValue;
    });
    // setState(updatedState);
  }
  const [state, setState] = useState(updatedState);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  useEffect(() => {
    if (!state.name) {
      setState(user);
    }
  }, [user]);

  const onChangeField = (key, val) => {
    setState({
      ...state,
      [key]: val,
    });
  };

  const cancel = () => {
    const updatedState = {};
    USER_SETTING_FIELDS.forEach((field) => {
      updatedState[field.key] = user[field.key] || field.initialValue;
    });
    setState(updatedState);
    setIsPhoneValid(true);
  };

  const canSave = () => {
    if (state.phone !== '' && !isPhoneValid) {
      return false;
    }
    // required field
    if (state.name === '' || state.zip === '') {
      return false;
    }
    // one required
    if (state.email === '' && state.phone === '') {
      return false;
    }
    if (state.email !== '' && !isValidEmail(state.email)) {
      return false;
    }
    if (state.zip !== '' && state.zip.length !== 5) {
      return false;
    }
    return true;
  };

  const submit = () => {
    const fields = { ...state };
    if (fields.phone) {
      fields.phone = fields.phone.replace(/\D+/g, '');
    }

    updateUserCallback(fields, userState);
  };

  return (
    <section className={styles.section}>
      <PortalPanel color="#EE6C3B">
        <h3
          className="text-[22px] tracking-wide font-black mb-16"
          data-cy="settings-title"
        >
          Settings
        </h3>
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {USER_SETTING_FIELDS.map((field) => (
                <Fragment key={field.key}>
                  {field.type === 'phone' ? (
                    <div className="mb-4">
                      <PhoneInput
                        value={state[field.key]}
                        onChangeCallback={(phone, isValid) => {
                          onChangeField(field.key, phone);
                          setIsPhoneValid(isValid);
                        }}
                        hideIcon
                      />
                    </div>
                  ) : (
                    <TextField
                      key={field.label}
                      value={state[field.key]}
                      fullWidth
                      variant="outlined"
                      label={field.label}
                      onChange={(e) => onChangeField(field.key, e.target.value)}
                      required={field.required}
                      style={{ marginBottom: '16px' }}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </Fragment>
              ))}
              <div className="row mt-20">
                <BlackButtonClient
                  disabled={!canSave()}
                  type="submit"
                  onClick={submit}
                >
                  <div className="py-0 px-6  font-black">Save</div>
                </BlackButtonClient>
                <div onClick={cancel} className="ml-5 underline cursor-pointer">
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

export default PersonalSection;
