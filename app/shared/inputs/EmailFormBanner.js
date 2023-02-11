'use client';

import { isValidEmail } from '@shared/inputs/EmailInput';
import { useState } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { subscribeEmail } from './EmailForm';

export default function EmailFormBanner({ pageName, formId }) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const canSubmit = () => isValidEmail(email);

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email: encodeURIComponent(email),
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
    <>
      <form
        className="h-[60px]"
        noValidate
        onSubmit={(e) => e.preventDefault()}
      >
        {success ? (
          <div className="flex items-center">
            <div className="mr-2">Check your email to learn more</div>{' '}
            <FaCheck />
          </div>
        ) : (
          <div className="relative">
            <input
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="john@email.com"
              className="py-4 pl-4 pr-16 mr-8 border-purple border-2 rounded-full w-full text-black"
            />
            <div
              onClick={submitForm}
              type="submit"
              value="→"
              className="bg-darkPurple absolute rounded-full right-2 top-2 p-3 text-white  font-bold cursor-pointer"
            >
              <FaArrowRight />
            </div>
            <input type="submit" value="" className="" />
          </div>
        )}
      </form>{' '}
      {!!showError && (
        <div className="text-sm sm: text-white lg:text-red-400 pl-5 mt-1 font-bold">
          {showError}
        </div>
      )}
    </>
  );
}
