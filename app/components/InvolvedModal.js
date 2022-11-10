'use client';

import { useState } from 'react';
import BlackButton from '../shared/buttons/BlackButton';
import Modal from '../shared/utils/Modal';

const InvolvedModal = () => {
  const [open, setOpen] = useState(false);
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
        <div>Tomer</div>
      </Modal>
    </>
  );
};

export default InvolvedModal;
