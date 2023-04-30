'use client';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function ScheduleModal({ campaign }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className="text-sm text-center underline mt-1 cursor-pointer"
        onClick={handleOpenModal}
      >
        View Support
      </div>
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
    </>
  );
}
