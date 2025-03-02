'use client';

import { useState } from 'react';
import { isValidEmail } from '@shared/inputs/EmailInput';
import Link from 'next/link';
import BlackButton from '@shared/buttons/BlackButton';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PinkButtonClient from '@shared/buttons/PinkButtonClient';
import Image from 'next/image';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

export async function subscribeEmail(payload) {
  try {
    await clientFetch(apiRoutes.homepage.subscribeEmail, payload);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SignatureForm({
  formId,
  pageName,
  label = 'SIGN NOW',
  labelId,
  tangerine,
  setSigner,
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const canSubmit = () => isValidEmail(email);

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email,
        firstName,
        lastName,
        uri: window.location.href,
        formId,
        pageName,
      });

      if (window.dataLayer) {
        window.dataLayer.push({
          event: labelId,
          'hs-form-guid': formId,
          'hs-form-name': labelId,
        });
      }

      if (success) {
        setSuccess(true);
        setShowError(false);
        const signature = `${firstName} ${lastName}, `;
        setSigner(signature);
        try {
          localStorage.setItem('signature', signature);
        } catch (e) {
          console.log(e);
        }
      } else {
        setShowError('An error occurred. Please try again.');
      }
    } else {
      setShowError('Please enter a valid email');
    }
  };
  return (
    <form
      className="pt-1"
      noValidate
      onSubmit={(e) => e.preventDefault()}
      id={labelId}
    >
      {success && !showShare ? (
        <div className="flex flex-col">
          <div>
            <div className="flex flex-row justify-center mx-auto mb-6">
              <Image
                src="/images/heart.svg"
                alt="GP"
                width={31}
                height={25}
                className="mr-3"
              />
              <p className="text-xl font-bold">GoodParty.org</p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-center mb-6">
              Thanks for signing!
            </p>
          </div>
          <div>
            <p className="text-xl text-center mb-6">
              John Hancock took a brave step and signed the declaration first.
              Share that you&apos;ve signed to inspire your friends too!
            </p>
          </div>
          <div>
            <div className="flex flex-row justify-center mx-auto mb-6">
              <Link href="/volunteer">
                <BlackButton
                  className="font-bold text-white text-sm"
                  style={{
                    padding: '0.625rem 1.25rem',
                    marginRight: '0.75rem',
                  }}
                >
                  Learn More
                </BlackButton>
              </Link>
              <PinkButtonClient
                className="py-3 px-4 mb-3 font-bold text-white text-sm"
                style={{
                  padding: '0.625rem 1.25rem',
                }}
                onClick={() => setShowShare(true)}
              >
                Share
              </PinkButtonClient>
            </div>
          </div>
        </div>
      ) : showShare ? (
        // <ShareCandidate />
        <div></div>
      ) : (
        <>
          <div className="flex flex-col">
            <input
              type="text"
              maxLength={35}
              name="firstName"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              placeholder="First Name"
              className={`py-4 pl-4 pr-36 mb-5 rounded-lg w-full border-solid border-2 border-gray-300 text-3xl ${tangerine.className} `}
            />

            <input
              type="text"
              maxLength={35}
              name="lastName"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              placeholder="Last Name"
              className={`py-4 pl-4 pr-36 mb-5 rounded-lg w-full border-solid border-2 border-gray-300 text-3xl ${tangerine.className} `}
            />

            <input
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="Email"
              className="py-4 pl-4 pr-36 mb-5 rounded-lg w-full border-solid border-2 border-gray-300"
            />

            <BlackButtonClient
              onClick={submitForm}
              id="submit-email"
              type="submit"
              className="w-full top-2 py-2.5 text-white px-5 font-bold cursor-pointer"
            >
              {label}
            </BlackButtonClient>

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
