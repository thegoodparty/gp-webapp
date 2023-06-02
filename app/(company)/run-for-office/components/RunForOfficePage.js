'use client';
import Script from 'next/script';
import { useState } from 'react';
import WhatWeDo from './WhatWeDo';
import Features from './Features';
import Hero from './Hero';
import dynamic from 'next/dynamic';
import styles from './RunForOffice.module.scss';
const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function RunForOfficePage() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="">
      <Hero demoCallback={handleOpenModal} />
      <div className={styles.boxTop} />
      <WhatWeDo demoCallback={handleOpenModal} />
      <div className={styles.boxBottom} />
      <Features demoCallback={handleOpenModal} />
      {/* <div className={styles.boxFooter} /> */}

      {showModal && (
        <Modal closeCallback={handleCloseModal} open>
          <div className="w-[80vw] max-w-[900px] h-[90vh]">
            <iframe
              src="https://meetings.hubspot.com/jared-alper"
              width="100%"
              height="100%"
            />
          </div>
        </Modal>
      )}

      <Script
        type="text/javascript"
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js.hs-scripts.com/21589597.js"
      />
    </div>
  );
}
