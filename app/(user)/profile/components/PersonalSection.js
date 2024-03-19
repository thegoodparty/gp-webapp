'use client';
/**
 *
 * PersonalSection
 *
 */

import { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/ProfileDropdown';
import { isValidEmail } from '@shared/inputs/EmailInput';
import PhoneInput from '@shared/inputs/PhoneInput';
import { setUserCookie } from 'helpers/cookieHelper';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FiSettings } from 'react-icons/fi';

async function refreshUser() {
  try {
    const api = gpApi.user.refresh;

    const { user } = await gpFetch(api);
    console.log('returned', user);
    return user;
  } catch (error) {
    console.log('Error updating user', error);
  }
}

async function updateUserCallback(updatedFields, userState) {
  try {
    const api = gpApi.user.updateUser;
    const payload = {
      ...updatedFields,
    };

    const response = await gpFetch(api, payload, 3600);
    const { user } = response;
    userState.set(() => user);
    setUserCookie(user);
  } catch (error) {
    console.log('Error updating user', error);
  }
}
export const USER_SETTING_FIELDS = [
  {
    key: 'firstName',
    label: 'First Name',
    initialValue: '',
    maxLength: 20,
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
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
];

function PersonalSection() {
  const userState = useHookstate(globalUserState);
  const user = userState.get('user');

  const updatedState = {};
  if (user) {
    USER_SETTING_FIELDS.forEach((field) => {
      updatedState[field.key] = user[field.key] || field.initialValue;
    });
  }
  const [state, setState] = useState(updatedState);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  useEffect(() => {
    updateUser();
  }, []);

  useEffect(() => {
    if (!state.email) {
      setState(user);
    }
  }, [user]);

  const updateUser = async () => {
    const updated = await refreshUser();
    userState.set(() => updated);
    setUserCookie(updated);
    // if (!state.email) {
    //   if (user) {
    //     const updatedState = {};
    //     USER_SETTING_FIELDS.forEach((field) => {
    //       updatedState[field.key] = updated[field.key] || field.initialValue;
    //     });
    //     setState(updatedState);
    //   }
    // }
  };

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
    <section className="py-4 border-b border-slate-300 flex">
      <div className="shrink-0 pr-3 text-indigo-50 pt-[6px]">
        <FiSettings />
      </div>
      <div className="flex-1">
        <H4>General</H4>
        <Body2 className="text-indigo-200 mb-6">
          Update your general information here
        </Body2>
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-12 gap-3">
            {USER_SETTING_FIELDS.map((field) => (
              <div key={field.key} className="col-span-12 lg:col-span-6">
                {field.type === 'phone' ? (
                  <div>
                    <PhoneInput
                      value={state[field.key]}
                      onChangeCallback={(phone, isValid) => {
                        onChangeField(field.key, phone);
                        setIsPhoneValid(isValid);
                      }}
                      hideIcon
                      shrink
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
              </div>
            ))}
            <div className="col-span-12 lg:col-span-6 flex justify-end items-end pb-4">
              <div onClick={submit}>
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

export default PersonalSection;
