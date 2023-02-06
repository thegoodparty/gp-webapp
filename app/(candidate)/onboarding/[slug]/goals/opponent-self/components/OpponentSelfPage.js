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

const generateAi = async () => {
  const api = gpApi.campaign.onboarding.generateOpponentSelf;
  return await gpFetch(api, { adminForce: true });
};

export default function OpponentSelfPage(props) {
  if (props.campaign?.opponentSelf) {
    initialState.whatRunning = props.campaign.opponentSelf.whatRunning;
    initialState.howDelivered = props.campaign.opponentSelf.howDelivered;
    initialState.whatDelivered = props.campaign.opponentSelf.whatDelivered;
    initialState.vote = props.campaign.opponentSelf.vote;
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const user = getUserCookie(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const updated = props.campaign;
    if (!updated.opponentSelf) {
      updated.opponentSelf = {};
    }
    updated.opponentSelf.whatRunning = state.whatRunning;
    updated.opponentSelf.howDelivered = state.howDelivered;
    updated.opponentSelf.whatDelivered = state.whatDelivered;
    updated.opponentSelf.vote = state.vote;
    await updateCampaign(updated);
    router.push(`onboarding/${props.slug}/strategy/who-are-you`);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleRegenerateAi = async () => {
    setLoading(true);
    await generateAi();
    window.location.reload();
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
          What will your OPPONENT say about THEMSELVES?
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
