'use client';

import H3 from '@shared/typography/H3';
import { useEffect, useState } from 'react';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { dateUsHelper } from 'helpers/dateHelper';
import Modal from '@shared/utils/Modal';
import OfficeStep from 'app/(candidate)/onboarding/[slug]/[step]/components/OfficeStep';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

const fields = [
  {
    key: 'office',
    label: 'Office',
    type: 'text',
  },

  {
    key: 'state',
    label: 'State',
    type: 'text',
  },

  {
    key: 'electionDate',
    label: 'Date of Election',
    type: 'date',
    campaignObj: 'goals',
  },
  {
    key: 'primaryElectionDate',
    label: 'Date of Primary Election',
    type: 'date',
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'text',
  },
];

export default function OfficeSection(props) {
  const initialState = {};
  fields.forEach((field) => {
    initialState[field.key] = '';
  });
  const [state, setState] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [campaign, setCampaign] = useState(props.campaign);

  useEffect(() => {
    if (campaign?.details && campaign?.goals) {
      const newState = {};
      fields.forEach((field) => {
        if (field.campaignObj === 'goals') {
          newState[field.key] = campaign.goals[field.key] || '';
        } else {
          newState[field.key] = campaign.details[field.key] || '';
        }
      });
      newState.office =
        campaign.details?.otherOffice || campaign.details?.office || '';
      if (newState.office === 'Other') {
        newState.office = campaign.details?.otherOffice;
      }
      setState(newState);
    }
  }, [campaign]);

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const res = await getCampaign();
    setCampaign(res.campaign);
    setShowModal(false);
  };

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3 className="pb-6">Office Details</H3>

      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <div key={field.key} className="col-span-12 md:col-span-6">
            <div className="mb-4">
              <TextField
                field={field}
                label={field.label}
                value={
                  field.type === 'date'
                    ? dateUsHelper(state[field.key])
                    : state[field.key]
                }
                disabled
                fullWidth
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-6 mt-2">
        <div onClick={handleEdit}>
          <PrimaryButton>Edit Office Details</PrimaryButton>
        </div>
      </div>
      <Modal
        open={showModal}
        closeCallback={() => {
          setShowModal(false);
        }}
        boxClassName="w-[95vw] lg:w-[60vw]"
      >
        <OfficeStep campaign={campaign} updateCallback={handleUpdate} />
      </Modal>
    </section>
  );
}
