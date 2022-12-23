'use client';
import EmailInput from '@shared/inputs/EmailInput';
import Image from 'next/image';
import React from 'react';
import Modal from '../utils/Modal';

export default function LoginModal({
  closeModalCallback,
  openRegisterCallback,
}) {
  const openRegister = () => {
    closeModalCallback();
    openRegisterCallback();
  };
  return (
    <Modal open closeCallback={closeModalCallback}>
      <div
        className="py-6 mx-auto pt-2 px-2  pb-6 lg:px-6"
        style={{ width: '75vw', maxWidth: '400px' }}
      >
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/black-logo.svg"
            data-cy="logo"
            width={174}
            height={20}
            alt="GOOD PARTY"
          />
        </div>
        <div className="text-center mb-8 pt-8">
          <h1
            data-cy="login-title"
            className="text-2xl lg:text-3xl  font-black"
          >
            Log into your account
          </h1>
        </div>
        <div className="my-6 text-sm" data-cy="register-label">
          Don&apos;t have an account?{' '}
          <span
            onClick={openRegister}
            className="underline"
            data-cy="redirect-to-login"
          >
            Create one
          </span>
        </div>
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          data-cy="email-form"
        >
          <EmailInput />
        </form>
      </div>
    </Modal>
  );
}
