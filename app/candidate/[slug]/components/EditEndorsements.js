'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H4 from '@shared/typography/H4';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import AddEndorsement from './AddEndorsement';
import Endorsements from './Endorsements';

export default function EditEndorsements(props) {
  const [showModal, setShowModal] = useState(false);
  const { candidate, campaign, isStaged } = props;

  let endorsements;
  if (isStaged && campaign) {
    endorsements = campaign.endorsements || [];
  } else {
    endorsements = candidate.endorsements || [];
  }

  return (
    <div>
      <div className="flex justify-between">
        <H4 className="text-indigo-50">Endorsements</H4>
        <div
          onClick={() => {
            setShowModal(true);
          }}
        >
          <PrimaryButton>Add Endorsement</PrimaryButton>
        </div>
      </div>

      {endorsements.map((endorsement) => (
        <Endorsements endorsement={endorsement} key={endorsement.name} />
      ))}
      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <AddEndorsement cancelCallback={() => setShowModal(false)} {...props} />
      </Modal>
    </div>
  );
}
