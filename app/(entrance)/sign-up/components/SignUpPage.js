'use client';
import { isValidEmail } from '@shared/inputs/EmailInput.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import { useHookstate } from '@hookstate/core';
import { Fragment, useState } from 'react';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { isValidPassword } from '@shared/inputs/IsValidPassword';
import Paper from '@shared/utils/Paper';
import Body2 from '@shared/typography/Body2';
import RenderInputField from '@shared/inputs/RenderInputField';
import Link from 'next/link';
import { useUser } from '@shared/hooks/useUser';
import saveToken from 'helpers/saveToken';

const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Jane',
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
    required: true,
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'hellow@email.com',
    required: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    type: 'phone',
    placeholder: '(123) 456-6789',
    cols: 6,
    noBottomMargin: true,
    required: true,
  },
  {
    key: 'zip',
    label: 'Zip Code',
    type: 'text',
    placeholder: '12345',
    cols: 6,
    noBottomMargin: true,
    required: true,
  },
];

export const validateZip = (zip) => {
  const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return validZip.test(zip);
};

async function register(firstName, lastName, email, phone, zip, password) {
  try {
    const api = gpApi.entrance.register;

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      zip,
      password,
    };
    const res = await gpFetch(api, payload);
    if (res.status === 409) {
      return { exists: true };
    }
    return res;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SignUpPage() {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zip: '',
    password: '',
  });

  const snackbarState = useHookstate(globalSnackbarState);
  const [_, setUser] = useUser();

  const enableSubmit = () =>
    isValidEmail(state.email) && isValidPassword(state.password);

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const { user, exists, token } = await register(
        state.firstName,
        state.lastName,
        state.email,
        state.phone,
        state.zip,
        state.password,
      );

      console.log('exists', exists);

      if (user) {
        setUser(user);
        // need to make it post request
        await saveToken(token);
        window.location.href = '/account-type';
        return;
      } else {
        if (exists) {
          snackbarState.set(() => {
            return {
              isOpen: true,
              message: `An account with this email (${state.email}) already exists`,
              isError: true,
            };
          });
        } else {
          snackbarState.set(() => {
            return {
              isOpen: true,
              message: 'Error creating account',
              isError: true,
            };
          });
        }
      }
    }
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <div className="bg-indigo-100">
      <MaxWidth>
        <div className="flex items-center justify-center">
          <div className="grid py-6 max-w-2xl w-[75vw]">
            <Paper className="p-5 md:p-8 lg:p-12">
              <div className="text-center mb-8 pt-8">
                <H1>Join GoodParty.org</H1>
                <Body2 className="mt-3">
                  Join the movement of candidates who refuse to accept the
                  status quo and are committed to breaking free from of the
                  two-party system.{' '}
                </Body2>
                <Body2 className="mt-3">
                  Already have an account?{' '}
                  <Link href="/login" className="underline text-info-main">
                    Login here.
                  </Link>
                </Body2>
              </div>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                id="register-page-form"
              >
                <div className="grid grid-cols-12 gap-4">
                  {fields.map((field) => (
                    <Fragment key={field.key}>
                      <RenderInputField
                        field={field}
                        onChangeCallback={onChangeField}
                        value={state[field.key]}
                      />
                    </Fragment>
                  ))}
                  <div className="col-span-12 mt-2">
                    <PasswordInput
                      label="Password"
                      value={state.password}
                      onChangeCallback={(pwd) => onChangeField('password', pwd)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Please don't use your dog name"
                    />
                  </div>
                </div>

                <div className="mt-8" onClick={handleSubmit}>
                  <PrimaryButton
                    disabled={!enableSubmit()}
                    type="submit"
                    fullWidth
                  >
                    Join
                  </PrimaryButton>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
