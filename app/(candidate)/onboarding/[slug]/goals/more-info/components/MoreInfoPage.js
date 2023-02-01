'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PortalPanel from '@shared/layouts/PortalPanel';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from '../../../pledge/components/PledgeButton';
import { getUserCookie } from 'helpers/cookieHelper';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const inputFields = [
  {
    key: 'electionDate',
    label: 'Date of Election',
    required: true,
    type: 'date',
  },
  {
    key: 'candidacyFiled',
    label: 'Have you filed statement of candidacy?',
    required: true,
    type: 'radio',
    option: ['Yes', 'No'],
  },
  {
    key: 'committee',
    label: 'If yes, please provide the name of candidate/campaign committee',
    type: 'text',
  },
  {
    key: 'moneyRaised',
    label: 'Money Raised to Date',
    type: 'text',
    required: true,
  },
  {
    key: 'opponent',
    label: 'Who are you running against?',
    type: 'text',
  },
];

const initialState = {};
const keys = [];

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
  keys.push(field.key);
});

export default function WhatPage(props) {
  const [loading, setLoading] = useState(false);

  const { campaign } = props;

  const user = getUserCookie(true);
  if (campaign?.moreInfo) {
    {
      keys.forEach((key) => {
        initialState[key] = campaign.moreInfo[key];
      });
    }
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const canSave = () => {
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (field.required) {
        if (field.initialValue && state[field.key] === field.initialValue) {
          return false;
        }
        if (!field.initialValue && state[field.key] === '') {
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    setLoading(true);
    const updated = campaign;
    if (!updated.moreInfo) {
      updated.moreInfo = {};
    }

    keys.forEach((key) => {
      updated.moreInfo[key] = state[key];
    });

    await updateCampaign(updated);
    if (state.opponent === '') {
      router.push(`onboarding/${props.slug}/strategy`);
    } else {
      router.push(`onboarding/${props.slug}/goals/opponent`);
    }
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-2">More Info</h3>
        <div className="mb-8">
          Please provide more information about your campaign
        </div>

        {inputFields.map((field) => (
          <RenderInputField
            field={field}
            onChangeCallback={onChangeField}
            error={!!errors[field.key]}
            positions={props.positions}
            value={state[field.key]}
          />
        ))}
        <div className="flex items-end justify-end">
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            <div className="font-black">Save &amp; Continue</div>
          </BlackButtonClient>
        </div>
      </PortalPanel>
      {loading && <LoadingAnimation label="Loading..." fullPage />}
    </OnboardingWrapper>
  );
}
