'use client';

import { isValidEmail } from '@shared/inputs/EmailInput';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

export async function subscribeEmail(payload) {
  try {
    await gpFetch(gpApi.homepage.subscribeEmail, payload);
    console.log('success');
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const canSubmit = () => isValidEmail(email);

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email: encodeURIComponent(email),
        uri: window.location.href,
        formId: '46116311-525b-42a2-b88e-d2ab86f26b8a',
        pageName: 'run for office',
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
    <form className="pt-5" noValidate onSubmit={(e) => e.preventDefault()}>
      {success ? (
        <div className="bg-purple text-white rounded-full mb-24 lg:mb-0 lg:w-[50%] xl:w-[45%] py-5 px-7 flex justify-between items-center">
          <div>Check your email to learn more</div>
          <div>
            <FaCheck />
          </div>
        </div>
      ) : (
        <div className="relative mb-24 lg:mb-0 lg:w-[50%] xl:w-[45%]">
          <input
            type="email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            placeholder="john@email.com"
            className="py-4 pl-4 pr-36 border-purple border-2 rounded-full w-full"
          />
          <input
            onClick={submitForm}
            id="involved-modal-submit-email"
            type="submit"
            value="Get Started"
            className="bg-purple absolute rounded-full right-2 top-2 py-2.5 text-white px-5 font-bold cursor-pointer"
          />
          {!!showError && (
            <div className="text-sm text-red-600 pl-5 pt-1 font-bold drop-shadow">
              {showError}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
