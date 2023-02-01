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
    key: 'whyRunning',
    label: 'Why are you running?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'bestChoice',
    label: 'Why are you the best choice?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'howDeliver',
    label: 'How are you going to deliver?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'whatDeliver',
    label: 'What are you going to deliver?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'voteReason',
    label: 'Vote for me, because...',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

const initialState = {};

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
});

const generateWhatGoals = async () => {
  const api = gpApi.campaign.onboarding.generateWhatGoals;
  return await gpFetch(api, { adminForce: true });
};

export default function WhatPage(props) {
  con/private/var/folders/_1/fv7qfk6d28387rcps7j8030c0000gp/T/AppTranslocation/D6532A63-B6A0-44DE-98E9-BEA2D5C028CE/d/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.htmlst [loading, setLoading] = useState(false);

  const user = getUserCookie(true);
  if (props.campaign?.whatGoals) {
    initialState.whyRunning = props.campaign.whatGoals.whyRunning;
    initialState.bestChoice = props.campaign.whatGoals.bestChoice;
    initialState.howDeliver = props.campaign.whatGoals.howDeliver;
    initialState.whatDeliver = props.campaign.whatGoals.whatDeliver;
    initialState.voteReason = props.campaign.whatGoals.voteReason;
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    const updated = props.campaign;
    if (!updated.whatGoals) {
      updated.whatGoals = {};
    }
    updated.whatGoals.whyRunning = state.whyRunning;
    updated.whatGoals.bestChoice = state.bestChoice;
    updated.whatGoals.howDeliver = state.howDeliver;
    updated.whatGoals.whatDeliver = state.whatDeliver;
    updated.whatGoals.voteReason = state.voteReason;
    await updateCampaign(updated);
    router.push(`onboarding/${props.slug}/goals/more-info`);
  };

  const handleRegenerateAi = async () => {
    setLoading(true);
    await generateWhatGoals();
    window.location.reload();
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
        <h3 className="font-black text-xl italic mb-2">The WHAT</h3>
        <div className="mb-8">
          It's time to define your race, and identify how you and others are
          going to talk about it.
        </div>
        <div className="font-black text-xl italic mb-6">
          First, how will YOU talk about your campaign?
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
          {user?.isAdmin && (
            <div className="mr-6">
              <BlackButtonClient
                onClick={handleRegenerateAi}
                style={{ backgroundColor: 'blue' }}
              >
                <div className="font-black">Regenerate AI input (Admin)</div>
              </BlackButtonClient>
            </div>
          )}
          <BlackButtonClient onClick={handleSave}>
            <div className="font-black">Save &amp; Continue</div>
          </BlackButtonClient>
        </div>
      </PortalPanel>
      {loading && <LoadingAnimation label="Loading..." fullPage />}
    </OnboardingWrapper>
  );
}
