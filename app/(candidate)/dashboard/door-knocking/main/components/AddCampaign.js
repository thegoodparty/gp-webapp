'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import RenderInputField from '@shared/inputs/RenderInputField';
import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import Modal from '@shared/utils/Modal';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';

async function createDkCampaign(
  name,
  type,
  minHousesPerRoute,
  maxHousesPerRoute,
  startDate,
  endDate,
) {
  try {
    const api = gpApi.doorKnocking.create;

    const payload = {
      name,
      type,
      minHousesPerRoute,
      maxHousesPerRoute,
      startDate,
      endDate,
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
  },
  {
    key: 'minHousesPerRoute',
    label: 'Minimum Houses Per Route',
    type: 'number',
    placeholder: '10 houses',
    cols: 6,
  },
  {
    key: 'maxHousesPerRoute',
    label: 'Maximum Houses Per Route (max - 100)',
    type: 'number',
    placeholder: '30 houses',
    cols: 6,
  },

  {
    key: 'startDate',
    label: 'Start Date',
    type: 'date',
    cols: 6,
  },
  {
    key: 'endDate',
    label: 'Deadline',
    type: 'date',
    cols: 6,
  },
];

export default function AddCampaign(props) {
  const { buttonLabel, campaignDates } = props;
  const [showModal, setShowModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState({
    campaignName: '',
    campaignType: '',
    minHousesPerRoute: '',
    maxHousesPerRoute: '',
    startDate: '',
    endDate: '',
  });

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
    if (state.minHousesPerRoute < 1 || state.maxHousesPerRoute > 100) {
      setError('Minimum houses per route must be between 1 and 100');
      return false;
    }
    if (state.minHousesPerRoute > state.maxHousesPerRoute) {
      setError(
        'Minimum houses per route must be less than maximum houses per route',
      );
      return false;
    }
    for (let i = 0; i < campaignDates.length; i++) {
      // campaign start date can't be between existing campaign start and end date
      if (
        new Date(state.startDate) >= new Date(campaignDates[i].start) &&
        new Date(state.startDate) <= new Date(campaignDates[i].end)
      ) {
        setError('Only one campaign can be active at a time');
        return false;
      }
      // campaign end date can't be between existing campaign start and end date
      if (
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
    setState({
      ...state,
      [key]: value,
    });
    setError('');
  };

  const handleSave = async () => {
    if (!canSave()) {
      return;
    }
    setSaving(true);
    const {
      campaignName,
      campaignType,
      minHousesPerRoute,
      maxHousesPerRoute,
      startDate,
      endDate,
    } = state;
    const { slug } = await createDkCampaign(
      campaignName,
      campaignType,
      minHousesPerRoute,
      maxHousesPerRoute,
      startDate,
      endDate,
    );

    if (slug) {
      // router.push(`/dashboard/door-knocking/campaign/${slug}`);
      window.location.reload();
    }
    setSaving(false);
  };
  return (
    <>
      <PrimaryButton
        onClick={() => {
          setShowModal(true);
        }}
      >
        {buttonLabel}
      </PrimaryButton>
      <Modal
        open={showModal}
        closeCallback={() => {
          setShowModal(false);
        }}
      >
        <div className="w-[90vw] max-w-xl">
          <H2>Create Door Knocking Campaign</H2>
          <Body1 className="mt-6">
            We use AI to create routes for your district. <br />
            Update the information below to curate how your routes are formed.
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
