'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHookstate } from '@hookstate/core';

import TextField from '@shared/inputs/TextField';
import { isValidEmail } from '@shared/inputs/EmailInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import styles from './RegisterPage.module.scss';
import { register } from '@shared/inputs/RegisterAnimated';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { setCookie, setUserCookie } from 'helpers/cookieHelper';
import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';

export const REGISTER_FIELDS = [
  {
    label: 'Full Name',
    key: 'name',
    type: 'text',
    required: true,
    helperText: '100 characters maximum',
  },
  {
    label: 'Email Address',
    key: 'email',
    type: 'email',
    required: true,
  },

  {
    label: 'Zip Code',
    key: 'zipcode',
    type: 'text',
    required: true,
  },
];

export default function RegisterPage({}) {
  const [score, setScore] = useState('good');
  const router = useRouter();
  // const pathname = usePathname();

  const userState = useHookstate(globalUserState);
  const user = userState.get();

  const [state, setState] = useState({
    name: user?.name || '',
    email: user?.email || '',
    zipcode: user?.zip || '',
  });

  const enableSubmit = () => {
    return (
      state.name.length >= 2 &&
      state.name.length <= 100 &&
      validateZip() &&
      validateEmail()
    );
  };

  const validateEmail = () => {
    return isValidEmail(state.email);
  };

  const validateZip = () => {
    const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return validZip.test(state.zipcode);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (enableSubmit()) {
      const user = await register({
        email: state.email,
        name: state.name,
        zip: state.zipcode,
      });
      userState.set(() => user);
      router.push('/profile');
    }
  };

  const onChangeField = (event, key) => {
    setState({
      ...state,
      [key]: event.target.value,
    });
  };

  const handleVerify = (token) => {
    if (token) {
      verifyRecaptchaCallback(token);
    }
  };

  const openLogin = () => {
    closeModalCallback();
    openLoginCallback();
  };

  return (
    <MaxWidth>
      <div className={` flex items-center justify-center ${styles.wrapper}`}>
        {score === 'bad' ? (
          <div className="py-6 max-w-2xl">
            <div
              className="text-center"
              style={{ marginBottom: '32px', paddingTop: '32px' }}
            >
              <h1
                data-cy="register-title"
                className="text-3xl lg:text-4xl font-black"
              >
                Sign up for Good Party
              </h1>

              <br />
              <br />
              <div>
                Sorry, we can't create an account for you at the moment.
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 max-w-2xl" style={{ width: '75vw' }}>
            <div className="text-center mb-8 pt-8">
              <h1
                data-cy="register-title"
                className="text-2xl lg:text-4xl font-black"
              >
                Sign up for Good Party
              </h1>
            </div>
            <div className="my-6 text-sm" data-cy="register-label">
              Already have an account?{' '}
              <Link href="/login" data-cy="redirect-to-login">
                login
              </Link>
            </div>
            <form
              noValidate
              onSubmit={handleSubmitForm}
              data-cy="email-form"
              id="register-page-form"
            >
              {REGISTER_FIELDS.map((field) => (
                <div data-cy="register-field" key={field.key} className="mb-8">
                  <TextField
                    className={styles.textField}
                    value={state[field.key]}
                    label={field.label}
                    required={field.required}
                    size="medium"
                    fullWidth
                    type={field.type}
                    name={field.key}
                    variant="outlined"
                    onChange={(e) => onChangeField(e, field.key)}
                    helperText={field.helperText}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              ))}

              <div>
                <BlackButtonClient
                  disabled={!enableSubmit()}
                  onClick={handleSubmit}
                  type="submit"
                  style={{ width: '100%' }}
                >
                  <strong>SIGN UP</strong>
                </BlackButtonClient>
              </div>
              {/* {!score && (
            <GoogleReCaptcha onVerify={handleVerify} action="REGISTER" />
          )} */}
            </form>
          </div>
        )}
      </div>
    </MaxWidth>
  );
}
