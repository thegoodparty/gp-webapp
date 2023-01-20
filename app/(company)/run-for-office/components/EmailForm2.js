'use client';

import { isValidEmail } from '@shared/inputs/EmailInput';
import { useState } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { subscribeEmail } from './EmailForm';

export default function EmailForm2() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

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
      }
    }
  };
  return (
    <form className="h-[60px]" noValidate onSubmit={(e) => e.preventDefault()}>
      {success ? (
        <div className="flex items-center">
          <div className="mr-2">Check your email to learn more</div> <FaCheck />
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
            disabled={!canSubmit()}
            onClick={submitForm}
            type="submit"
            value="→"
            className="bg-darkPurple absolute rounded-full right-2 top-2 p-3 text-white  font-bold cursor-pointer"
            style={
              !canSubmit() && email !== ''
                ? { opacity: '0.5', cursor: 'not-allowed' }
                : {}
            }
          >
            <FaArrowRight />
          </div>
          <input type="submit" value="" className="" />
        </div>
      )}
    </form>
  );
}
