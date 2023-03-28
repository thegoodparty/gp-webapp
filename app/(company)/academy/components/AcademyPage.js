'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import HubSpotForm from '@shared/utils/HubSpotForm';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import Curriculum from './Curriculum';
import Hero from './Hero';
import Instructors from './Instructors';
import LearnMore from './LearnMore';
import Timeline from './Timeline';
import YouGet from './YouGet';

export default function AcademyPage() {
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  return (
    <div className="mb-8">
      <Hero openModalCallback={handleOpenModal} />
      <MaxWidth>
        <Curriculum openModalCallback={handleOpenModal} />
        <Timeline />
        <YouGet openModalCallback={handleOpenModal} />
        <Instructors />
        <LearnMore openModalCallback={handleOpenModal} />
      </MaxWidth>
      <Modal
        open={showModal}
        closeCallback={() => {
          setShowModal(false);
        }}
      >
        <h2 className="text-2xl font-black my-6">
          Please provide your email to register
        </h2>
        <HubSpotForm formId="46116311-525b-42a2-b88e-d2ab86f26b8a" />
      </Modal>
    </div>
  );
}
