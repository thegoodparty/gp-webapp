'use client';
import Script from 'next/script';
import { useState } from 'react';
import WhatWeDo from './WhatWeDo';
import Features from './Features';
import Hero from './Hero';
import Cta from './Cta';
import Blog from './Blog';
import dynamic from 'next/dynamic';
const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function RunForOfficePage({ articles }) {
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
      <div className="bg-[linear-gradient(-172deg,_#FFFFFF_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <WhatWeDo demoCallback={handleOpenModal} />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#FFFFFF_55%)] h-[calc(100vw*.17)] w-full" />
      <Features demoCallback={handleOpenModal} />
      <Blog articles={articles} />
      <Cta />
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
