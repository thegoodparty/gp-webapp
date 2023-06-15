'use client';
import Pill from '@shared/buttons/Pill';
import { FaShare } from 'react-icons/fa';
import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import ShareCandidate from './ShareCandidate';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { RiShareForwardLine } from 'react-icons/ri';

export default function ShareButton(props) {
  const { candidate, children } = props;
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <>
      <div
        onClick={() => {
          setShowShareModal(true);
        }}
        id="candidate-share-pill"
      >
        {children}
      </div>
      <Modal
        open={showShareModal}
        closeCallback={() => setShowShareModal(false)}
      >
        <ShareCandidate candidate={candidate} />
      </Modal>
    </>
  );
}
