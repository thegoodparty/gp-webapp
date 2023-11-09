'use client';
import Script from 'next/script';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Hero from './Hero';
import FactsSection from './FactsSection';
import HowSection from './HowSection';
import ToolsSection from './ToolsSection';
import Cta from './Cta';
import Callout from '@shared/utils/Callout';
import ElectionCandidates from 'app/(company)/elections/[...params]/components/ElectionCandidates';
const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function HomePage(props) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-slate-50">
      <Callout />

      <Hero />
      <ElectionCandidates {...props} theme="light" />

      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <FactsSection />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />
      <HowSection />
      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <ToolsSection />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />

      <Cta demoCallback={handleOpenModal} />
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
