'use client';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import PasswordInput from '@shared/inputs/PasswrodInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi/index.js';
import {
  deleteCookie,
  getCookie,
  setUserCookie,
} from 'helpers/cookieHelper.js';
import { useHookstate } from '@hookstate/core';
import Link from 'next/link.js';
import { Fragment, Suspense, useState } from 'react';
import gpFetch from 'gpApi/gpFetch.js';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import { globalUserState } from '@shared/layouts/navigation/ProfileDropdown';
import SocialRegisterButtons from './SocialRegisterButtons';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { isValidPassword } from '@shared/inputs/IsValidPassword';
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus';
import Paper from '@shared/utils/Paper';
import Body2 from '@shared/typography/Body2';
import RenderInputField from '@shared/inputs/RenderInputField';

const fields = [
  { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'Jane' },
  { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'hellow@email.com',
  },
  {
    key: 'phone',
    label: 'Phone Number',
    type: 'phone',
    placeholder: '(123) 456-6789',
    cols: 6,
    noBottomMargin: true,
  },
  {
    key: 'zip',
    label: 'Zip Code',
    type: 'text',
    placeholder: '12345',
    cols: 6,
    noBottomMargin: true,
  },
];

export const validateZip = (zip) => {
  const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return validZip.test(zip);
};

async function login(email, password) {
  try {
    const api = gpApi.entrance.login;
    const payload = {
      email,
      password,
    };
    return await gpFetch(api, payload);
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

  const userState = useHookstate(globalUserState);
  const snackbarState = useHookstate(globalSnackbarState);

  const enableSubmit = () =>
    isValidEmail(state.email) && isValidPassword(state.password);

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const { user, newUser } = await login(state.email, state.password);

      if (user) {
        setUserCookie(user);
        userState.set(() => user);
        if (newUser) {
          const afterAction = getCookie('afterAction');
          if (
            (user.firstName && user.firstName !== '') ||
            afterAction === 'createCampaign'
          ) {
            await createCampaign();
            return;
          }
          if (user.firstName === '' || !user.firstName) {
            window.location.href = '/set-name';
            return;
          }
        } else {
          const returnUrl = getCookie('returnUrl');
          if (returnUrl) {
            deleteCookie('returnUrl');
            window.location.href = returnUrl;
            return;
          }

          const status = await fetchCampaignStatus();

          if (status?.status === 'candidate') {
            window.location.href = '/dashboard';
            return;
          }
          if (status?.status === 'volunteer') {
            window.location.href = '/volunteer-dashboard';
            return;
          }
          window.location.href = '/';
        }
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'The email or password are wrong.',
            isError: true,
          };
        });
      }
    }
  };

  const onChangeField = (value, key) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <div className="bg-indigo-100">
      <MaxWidth>
        <div className={`flex items-center justify-center`}>
          <div className="grid py-6 max-w-2xl w-[75vw]">
            <Paper className="p-5 md:p-8 lg:p-12">
              <div className="text-center mb-8 pt-8">
                <H1>Join GoodParty.org</H1>
                <Body2 className="mt-3">
                  Join the movement of candidates who refuse to accept the
                  status quo and are committed to breaking free from of the
                  two-party system.{' '}
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
                        onChangeCallback={(value) =>
                          onChangeField(value, field.key)
                        }
                        value={state[field.key]}
                      />
                    </Fragment>
                  ))}
                  <div className="col-span-12 mt-2">
                    <PasswordInput
                      label="Password"
                      onChangeCallback={(pwd) => onChangeField(pwd, 'password')}
                      InputLabelProps={{
                        shrink: true,
                      }}
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

              <Suspense>
                <SocialRegisterButtons />
              </Suspense>
            </Paper>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
