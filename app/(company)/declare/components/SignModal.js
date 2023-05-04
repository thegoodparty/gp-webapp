'use client';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import BaseButtonClient from '@shared/buttons/BaseButtonClient';
import SignForm from './SignForm';

export default function AiModal({ submitCallback, showWarning }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <BaseButtonClient
        className="py-3 px-4 mb-3 ml-3 font-bold bg-pink-600 text-white text-sm"
        style={{
          borderRadius: '9999px',
          padding: '0.625rem 1.25rem',
        }}
        onClick={() => setShowModal(true)}
      >
        SIGN NOW
      </BaseButtonClient>

      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div
          className="flex flex-col p-4"
          style={{ maxWidth: '465px', minWidth: '300px' }}
        >
          <h3 className="text-xl font-black mb-9 flex items-center justify-center">
            <div className="ml-3">
              Leave your John Hancock and declare your independence!
            </div>
          </h3>
          <SignForm
            fullWidth
            formId="37d98f01-7062-405f-b0d1-c95179057db1"
            pageName="Declare"
            label="SIGN NOW"
            labelId="signature-form"
          />
        </div>
      </Modal>
    </>
  );
}
