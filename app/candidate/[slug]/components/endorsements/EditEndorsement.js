'use client';

import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import { RiPencilLine } from 'react-icons/ri';
import EditEndorsementModal from './EditEndorsementModal';

export default function EditEndorsement(props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="absolute top-0 right-0 p-2 cursor-pointer text-lg"
        onClick={() => setShowModal(true)}
      >
        <RiPencilLine />
      </div>

      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <EditEndorsementModal
          cancelCallback={() => setShowModal(false)}
          {...props}
        />
      </Modal>
    </>
  );
}
