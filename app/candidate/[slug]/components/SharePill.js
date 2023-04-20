'use client';
import Pill from '@shared/buttons/Pill';
import { FaShare } from 'react-icons/fa';
import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import ShareCandidate from './ShareCandidate';

export default function SharePill(props) {
  const { candidate, color, textColor } = props;
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <>
      <div
        onClick={() => {
          setShowShareModal(true);
        }}
      >
        <Pill
          style={{
            backgroundColor: color,
            color: textColor,
            borderColor: color,
          }}
          className="mr-5"
        >
          <div className="flex items-center" style={{ color: textColor }}>
            <FaShare className="mr-2" /> Share
          </div>
        </Pill>
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
