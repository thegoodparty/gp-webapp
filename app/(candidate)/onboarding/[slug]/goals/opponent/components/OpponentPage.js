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
    key: 'notBestChoice',
    label: "Why we aren't the best choice",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'notDeliver',
    label: "Why we won't deliver results",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'distinctions',
    label: 'Key distinctions',
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

export default function OpponentPage(props) {
  if (props.campaign?.opponent) {
    initialState.notBestChoice = props.campaign.opponent.notBestChoice;
    initialState.notDeliver = props.campaign.opponent.notDeliver;
    initialState.distinctions = props.campaign.opponent.distinctions;
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSave = async () => {
    const updated = props.campaign;
    if (!updated.opponent) {
      updated.opponent = {};
    }
    updated.opponent.notBestChoice = state.notBestChoice;
    updated.opponent.notDeliver = state.notDeliver;
    updated.opponent.distinctions = state.distinctions;
    await updateCampaign(updated);
    router.push(`onboarding/${props.slug}/goals/about-opponent`);
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
          What will your OPPONENT say about YOU?
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
