'use client';

import { isValidEmail } from '@shared/inputs/EmailInput';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import BaseButtonClient from '../buttons/BaseButtonClient';

export async function subscribeEmail(payload) {
  try {
    await gpFetch(gpApi.homepage.subscribeEmail, payload);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function EmailForm({
  formId,
  fullWidth = false,
  pageName,
  label = 'Get Started',
  labelId,
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const canSubmit = () => isValidEmail(email);

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email: encodeURIComponent(email),
        firstName: encodeURIComponent(firstName),
        lastName: encodeURIComponent(lastName),
        uri: window.location.href,
        formId,
        pageName,
      });
      if (success) {
        setSuccess(true);
        setShowError(false);
      } else {
        setShowError('An error occurred. Please try again.');
      }
    } else {
      setShowError('Please enter a valid email');
    }
  };
  return (
    <form
      className="pt-5"
      noValidate
      onSubmit={(e) => e.preventDefault()}
      id={labelId}
    >
      {success ? (
        <div
          className={`bg-black text-white rounded-lg mb-24 w-full py-5 px-7 flex justify-between items-center`}
        >
          <div>Check your email to learn more</div>
          <div>
            <FaCheck />
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col ${!fullWidth && 'lg:w-[50%] xl:w-[45%]'}`}
          >
            <input
              type="text"
              name="firstName"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              placeholder="First Name"
              className="py-4 pl-4 pr-36 mb-5 rounded-lg w-full"
            />

            <input
              type="text"
              name="lastName"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              placeholder="Last Name"
              className="py-4 pl-4 pr-36 mb-5 rounded-lg w-full"
            />

            <input
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="john@email.com"
              className="py-4 pl-4 pr-36 mb-5 rounded-lg w-full"
            />

            <BaseButtonClient
              onClick={submitForm}
              id="submit-email"
              type="submit"
              className="bg-black w-full top-2 py-2.5 text-white px-5 font-bold cursor-pointer"
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
      )}
    </form>
  );
}
