'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PortalPanel from '@shared/layouts/PortalPanel';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from '../../../pledge/components/PledgeButton';

const inputFields = [
  {
    key: 'whatRunning',
    label: "What they're running",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'howDelivered',
    label: "How they've delivered (if incumbent)",
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },

  {
    key: 'whatDelivered',
    label: "What they've delivered (if incumbent)",
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'vote',
    label: 'Vote for them',
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

export default function OpponentSelfPage(props) {
  if (props.campaign?.selfOpponent) {
    initialState.whatRunning = props.campaign.selfOpponent.whatRunning;
    initialState.howDelivered = props.campaign.selfOpponent.howDelivered;
    initialState.whatDelivered = props.campaign.selfOpponent.whatDelivered;
    initialState.vote = props.campaign.selfOpponent.vote;
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSave = async () => {
    const updated = props.campaign;
    if (!updated.selfOpponent) {
      updated.selfOpponent = {};
    }
    updated.selfOpponent.whatRunning = state.whatRunning;
    updated.selfOpponent.howDelivered = state.howDelivered;
    updated.selfOpponent.whatDelivered = state.whatDelivered;
    updated.selfOpponent.vote = state.vote;
    await updateCampaign(updated);
    router.push(`onboarding/${props.slug}/strategy`);
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
          What will YOU say about your OPPONENT?
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
          <BlackButtonClient onClick={handleSave}>
            <div className="font-black">Save &amp; Continue</div>
          </BlackButtonClient>
        </div>
      </PortalPanel>
    </OnboardingWrapper>
  );
}
