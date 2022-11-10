'use client';

import { useState } from 'react';
import Link from 'next/link';

import { gpApi } from '/gpApi';
import gpFetch from '/gpApi/gpFetch';
import TextField from '../shared/inputs/TextField';
import BlackButton from '../shared/buttons/BlackButton';
import BlackButtonClient from '../shared/buttons/BlackButtonClient';
import Modal from '../shared/utils/Modal';
import { getUserCookie } from '/helpers/cookieHelper';
import EmailInput, { isValidEmail } from '../shared/inputs/emailInput';

async function subscribeEmail(payload) {
  try {
    await gpFetch(gpApi.homepage.subscribeEmail, payload);
    console.log('success');
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function InvolvedModal() {
  const [open, setOpen] = useState(false);
  const user = getUserCookie(true);
  const [name, setName] = useState(user ? `${user.name}` : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const canSubmit = () => isValidEmail(email) && name !== '' && name.length > 2;

  const submitForm = async () => {
    if (canSubmit()) {
      const success = await subscribeEmail({
        email: encodeURIComponent(email),
        name,
        uri: window.location.href,
      });
      if (success) {
        setOpen(false);
      }
    }
  };
  return (
    <>
      <div
        id="what-do-i-do-button"
        onClick={() => {
          setOpen(true);
        }}
      >
        <BlackButton>
          <div className="text-base font-bold">GET INVOLVED</div>
        </BlackButton>
      </div>
      <Modal
        open={open}
        closeCallback={() => {
          setOpen(false);
        }}
      >
        <div className="py-8">
          <div className="text-3xl font-black">Get Involved</div>
          <div className="font-black mt-5 text-lg">
            Subscribe to get our updates!{' '}
            <span role="img" aria-label="heart" style={{ color: 'red' }}>
              ❤
            </span>{' '}
            <span role="img" aria-label="Party">
              🎉️
            </span>
          </div>
        </div>
        <div className="mb-6 border-t" />
        <div className="py-6">
          <form
            noValidate
            onSubmit={(e) => e.preventDefault()}
            id="homepage-involved-form"
          >
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={name != '' && name.length < 2}
              autoFocus
            />
            <br />
            <br />
            <EmailInput
              hideIcon
              onChangeCallback={handleEmailChange}
              value={email}
            />
            <br />
            <br />
            <BlackButtonClient
              disabled={!canSubmit()}
              onClick={submitForm}
              id="involved-modal-submit-email"
              type="submit"
              style={{ width: '100%' }}
            >
              <strong>SUBMIT</strong>
            </BlackButtonClient>
          </form>
          <br />
          <br />
          <div className="text-center">
            <Link href="/candidates">Find Good Candidates</Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
