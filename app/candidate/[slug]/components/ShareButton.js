'use client';
import Pill from '@shared/buttons/Pill';
import { FaShare } from 'react-icons/fa';
import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import ShareCandidate from './ShareCandidate';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { RiShareForwardLine } from 'react-icons/ri';

export default function ShareButton(props) {
  const { candidate, color, textColor } = props;
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <>
      <div
        onClick={() => {
          setShowShareModal(true);
        }}
        id="candidate-share-pill"
      >
        <PrimaryButton>
          <div className="text-lime-500 flex items-center">
            <div className="mr-2">Share</div>
            <RiShareForwardLine />
          </div>
        </PrimaryButton>
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
