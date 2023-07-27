'use client';
import Script from 'next/script';
import { useState } from 'react';
import Hero from './ElectionHero';
import Candidates from './ElectionCandidates';
import Volunteer from './ElectionVolunteer';
import Blog from './ElectionBlog';
import dynamic from 'next/dynamic';
const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function ElectionPage(props) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const volunteerProps = {
    handleOpenModal,
    ...props,
  };

  return (
    <div className="bg-slate-50">
      {/* <Hero {...props} /> */}
      <Candidates {...props} />
      <Volunteer {...volunteerProps} />

      {showModal && (
        <Modal closeCallback={handleCloseModal} open>
          <div className="w-[90vw] md:w-[80vw] max-w-[900px] h-[70vh] md:h-[90vh]">
            <iframe
              src="https://meetings.hubspot.com/robbooth/gp-info-session"
              width="100%"
              height="100%"
            />
          </div>
        </Modal>
      )}

      <Blog {...props} />

      <Script
        type="text/javascript"
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js.hs-scripts.com/21589597.js"
      />
    </div>
  );
}
