'use client';
import { useEffect, useState } from 'react';
import HubSpotForm from '@shared/utils/HubSpotForm';
import Modal from '@shared/utils/Modal';
import Image from 'next/image';
import { setCookie, getCookie } from 'helpers/cookieHelper.js';

export default function BlogPopup() {
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const cookie = getCookie('blogPopup');
    if (!cookie || cookie !== 'closed') {
      const timer = setTimeout(handleOpenModal, 60000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <Modal
      open={showModal}
      closeCallback={() => {
        setShowModal(false);
        setCookie('blogPopup', 'closed', 1);
      }}
      center={false}
    >
      <Image
        src="/images/heart-hologram.svg"
        alt="GoodParty"
        width={46}
        height={46}
      />

      <h2 className="text-2xl font-black my-6">
        Stay up to date with Good Party
      </h2>
      <HubSpotForm formId="5d84452a-01df-422b-9734-580148677d2c" />
    </Modal>
  );
}
