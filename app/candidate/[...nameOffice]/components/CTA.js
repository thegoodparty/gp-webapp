'use client';

import Modal from '@shared/utils/Modal';
import { trackEvent } from 'helpers/fullStoryHelper';
import { useState } from 'react';

export default function CTA({ children }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    // trackEvent('candidate CTA clicked', {})
  };
  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        open={open}
        closeCallback={() => {
          setOpen(false);
        }}
      >
        to do
      </Modal>
    </>
  );
}
