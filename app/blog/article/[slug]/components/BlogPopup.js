'use client';
import { useEffect, useState } from 'react';
import HubSpotForm from '@shared/utils/HubSpotForm';
import SignupForm from '@shared/inputs/SignupForm';
import ModalCorner from '@shared/utils/ModalCorner';
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
      const timer = setTimeout(handleOpenModal, 30000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <ModalCorner
      open={showModal}
      closeCallback={() => {
        setShowModal(false);
        setCookie('blogPopup', 'closed', 1);
      }}
    >
      <Image
        src="/images/heart-hologram.svg"
        alt="GoodParty"
        width={46}
        height={46}
      />

      <h2 className="text-2xl font-black my-1">
        Stay up to date with Good Party
      </h2>
      {/* <HubSpotForm formId="5d84452a-01df-422b-9734-580148677d2c" /> */}

      <SignupForm
        formId="5d84452a-01df-422b-9734-580148677d2c"
        pageName={`blog-article`}
        label="Get involved"
        labelId="blog-form"
        horizontal={false}
        phoneField={false}
        onSuccessCallback={() => {
          setShowModal(false);
          setCookie('blogPopup', 'closed', 1);
        }}
      />
    </ModalCorner>
  );
}
