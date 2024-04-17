'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import RenderInputField from '@shared/inputs/RenderInputField';
import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import Modal from '@shared/utils/Modal';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';

async function updateDkCampaign(name, startDate, endDate, slug) {
  try {
    const api = gpApi.doorKnocking.update;

    const payload = {
      name,
      startDate,
      endDate,
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const fields = [
  {
    key: 'campaignName',
    label: 'Campaign Name',
    type: 'text',
    placeholder: 'Example: Issue Awareness',
  },
  {
    key: 'campaignType',
    label: 'Campaign Type',
    type: 'select',
    options: [
      'Get Out The Vote',
      'Candidate Awareness',
      'Voter Issues/Candidate Issue Awareness',
    ],
    disabled: true,
  },
  {
    key: 'maxHousesPerRoute',
    label: 'Maximum Houses Per Route (max - 100)',
    type: 'number',
    placeholder: '30 houses',
    cols: 6,
    disabled: true,
  },

  {
    key: 'startDate',
    label: 'Start Date',
    type: 'date',
    cols: 6,
    disabled: true,
  },
  {
    key: 'endDate',
    label: 'Deadline',
    type: 'date',
    cols: 6,
  },
];

export default function ManageCampaign(props) {
  const { campaign, campaignDates } = props;
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [saving, setSaving] = useState(false);
  const [state, setState] = useState({
    campaignName: campaign.name || '',
    campaignType: campaign.type || '',
    maxHousesPerRoute: campaign.maxHousesPerRoute || '',
    startDate: campaign.startDate || '',
    endDate: campaign.endDate || '',
  });
  if (new Date(campaign.startDate) > new Date()) {
    fields[4].disabled = false;
  }

  const canSave = () => {
    if (saving) {
      return false;
    }
    for (let key in state) {
      if (state[key] === '') {
        setError('Please fill out all fields');
        return false;
      }
    }
    try {
      if (new Date(state.startDate) >= new Date(state.endDate)) {
        setError('Start date must be before end date');
        return false;
      }
    } catch (e) {
      return false;
    }
    for (let i = 0; i < campaignDates.length; i++) {
      if (
        campaignDates[i].slug !== campaign.slug &&
        new Date(state.endDate) >= new Date(campaignDates[i].start) &&
        new Date(state.endDate) <= new Date(campaignDates[i].end)
      ) {
        setError('Only one campaign can be active at a time');
        return false;
      }
    }
    return true;
  };

  const onChangeField = (key, value) => {
    setError('');
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleSave = async () => {
    if (!canSave()) {
      return;
    }
    setSaving(true);
    const { campaignName, endDate, startDate } = state;
    const { slug } = await updateDkCampaign(
      campaignName,
      startDate,
      endDate,
      campaign.slug,
    );

    if (slug) {
      window.location.reload();
    }
    setSaving(false);
  };

  console.log('campaign', campaign);
  return (
    <>
      <div
        className="p-4  whitespace-nowrap"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Manage Campaign
      </div>

      <Modal
        open={showModal}
        closeCallback={() => {
          setShowModal(false);
        }}
      >
        <div className="w-[90vw] max-w-xl">
          <H2>Manage {campaign.name} Campaign</H2>
          <Body1 className="mt-1 mb-3">
            Update your door knocking campaign information.
          </Body1>
          <div className="grid grid-cols-12 gap-4 mt-6">
            {fields.map((field) => (
              <RenderInputField
                key={field.key}
                field={field}
                value={state[field.key]}
                onChangeCallback={onChangeField}
              />
            ))}
          </div>
          <div className="mt-10 mb-4 text-error">{error || ' '}</div>
          <div className="flex justify-end">
            <div
              onClick={() => {
                setShowModal(false);
              }}
              className="mr-3"
            >
              <PrimaryButton variant="outlined">Cancel</PrimaryButton>
            </div>
            <div onClick={handleSave}>
              <PrimaryButton>Save &amp; Continue</PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
