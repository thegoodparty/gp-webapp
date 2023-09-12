'use client';

import { isValidEmail } from '@shared/inputs/EmailInput';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import BaseButtonClient from '../buttons/BaseButtonClient';
import PhoneInput from '@shared/inputs/PhoneInput';
import TextField from '@shared/inputs/TextField';
import EmailInput from '@shared/inputs/EmailInput';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export async function subscribeEmail(payload) {
  try {
    await gpFetch(gpApi.homepage.subscribeEmail, payload);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SignupForm({
  formId,
  fullWidth = false,
  pageName,
  label = 'Get Started',
  labelId,
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showError, setShowError] = useState(false);
  const [phone, setPhone] = useState('');
  const [showForm, setShowForm] = useState(true);

  const canSubmit = () => isValidEmail(email);
  const snackbarState = useHookstate(globalSnackbarState);

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email: encodeURIComponent(email),
        firstName: encodeURIComponent(firstName),
        lastName: encodeURIComponent(lastName),
        phone: encodeURIComponent(phone),
        uri: window.location.href,
        formId,
        pageName,
      });
      if (success) {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Check your email to learn more',
            isError: false,
            autoHideDuration: null,
          };
        });
        setShowForm(false);
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'An error occurred. Please try again.',
            isError: true,
          };
        });
      }
    } else {
      setShowError('Please enter a valid email');
    }
  };
  return (
    showForm && (
      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        id={labelId}
        className="flex w-full"
      >
        <>
          <div
            className={`flex flex-col w-full items-center justify-center lg:flex-row mb-10`}
          >
            <div className="flex flex-col w-full items-center lg:items-start">
              <div className="flex flex-row w-full md:max-w-[300px] items-start mr-5">
                <span className="text-sm ml-5">First Name</span>
                <span className="text-sm text-red-600 ml-1">*</span>
              </div>
              <TextField
                name="firstName"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                fullWidth
                value={firstName}
                placeholder="Jane"
                className="py-4 pl-4 mb-5 rounded-lg w-full bg-slate-50 border-[1px] border-indigo-200 text-black  max-w-full md:max-w-[300px]"
              />
            </div>

            <div className="flex flex-col w-full items-center lg:items-start mt-5 lg:mt-0 lg:ml-5">
              <div className="flex flex-row w-full md:max-w-[300px] items-start mr-5">
                <span className="text-sm ml-5">Last Name</span>
                <span className="text-sm text-red-600 ml-1">*</span>
              </div>
              <TextField
                name="lastName"
                size="medium"
                fullWidth
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
                placeholder="Doe"
                className="py-4 pl-4 mb-5 rounded-lg w-full bg-slate-50 border-[1px] border-indigo-200 text-black max-w-full md:max-w-[300px]"
              />
            </div>

            <div className="flex flex-col w-full items-center lg:items-start mt-5 lg:mt-0 lg:ml-5">
              <div className="flex flex-row w-full md:max-w-[300px] items-start mr-5">
                <span className="text-sm ml-5">Email</span>
                <span className="text-sm text-red-600 ml-1">*</span>
              </div>
              <EmailInput
                name="email"
                onChangeCallback={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                placeholder="jane.doe@email.com"
                useLabel={false}
                className="py-4 pl-4 mb-5 rounded-lg w-full bg-slate-50 border-[1px] border-indigo-200 text-black max-w-full md:max-w-[300px]"
              />
            </div>

            <div className="flex flex-col w-full items-center lg:items-start mt-5 lg:mt-0 lg:ml-5">
              <div className="flex flex-row w-full md:max-w-[300px] items-start mr-5">
                <span className="text-sm ml-5">Phone Number (optional)</span>
              </div>
              <PhoneInput
                onChangeCallback={(phone, isValid) => {
                  setPhone(phone);
                }}
                useLabel={false}
                placeholder="(123) 456-7890"
                className="py-4 pl-4 mb-5 rounded-lg w-full bg-slate-50 border-[1px] border-indigo-200 text-black max-w-full md:max-w-[300px]"
                hideIcon
                shrink
              />
            </div>

            <BaseButtonClient
              onClick={submitForm}
              id="submit-email"
              type="submit"
              className="bg-black w-full text-white font-bold cursor-pointer md:max-w-[300px] mt-5 lg:mt-0 lg:ml-5 lg:mt-5"
            >
              {label}
            </BaseButtonClient>

            {!!showError && (
              <div className="text-sm text-red-600 pl-5 pt-1 font-bold drop-shadow">
                {showError}
              </div>
            )}
          </div>
        </>
      </form>
    )
  );
}
