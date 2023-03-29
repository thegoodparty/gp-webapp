'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function ScheduleModal({ key, unlocked }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <div
        className="bg-yellow-400  py-4 px-12 inline-block rounded-full cursor-pointer transition-colors hover:bg-yellow-200"
        onClick={handleOpenModal}
      >
        <div className="font-black">SCHEDULE</div>
      </div>
      {showModal && (
        <Modal closeCallback={() => setShowModal(false)} open>
          <div className="w-[80vw] max-w-[900px] h-[90vh]">
            <iframe
              src="https://meetings.hubspot.com/jared-alper"
              width="100%"
              height="100%"
            />
          </div>
        </Modal>
      )}
    </>
  );
}
