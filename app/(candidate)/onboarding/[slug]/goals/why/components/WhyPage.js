'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PortalPanel from '@shared/layouts/PortalPanel';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from '../../../pledge/components/PledgeButton';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import { getUserCookie } from 'helpers/cookieHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const inputFields = [
  {
    key: 'twoMinutes',
    label: '2 minutes / 100 words',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  // {
  //   key: 'oneMinute',
  //   label: '1 minute / 50 words',
  //   required: true,
  //   type: 'text',
  //   rows: 4,
  // },
  // {
  //   key: 'halfMinute',
  //   label: '30 seconds / 50 words',
  //   required: true,
  //   type: 'text',
  //   rows: 4,
  // },
];

const initialState = {};

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
});

const generateWhyGoals = async () => {
  const api = gpApi.campaign.onboarding.generateWhyGoals;
  return await gpFetch(api, { adminForce: true });
};

export default function WhyPage(props) {
  if (props.campaign?.whyGoals) {
    initialState.twoMinutes = props.campaign.whyGoals.why100;
  }
  const user = getUserCookie(true);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    const updated = props.campaign;
    updated.whyGoals.why100 = state.twoMinutes;
    const res = await updateCampaign(updated);
    if (res) {
      router.push(`onboarding/${props.slug}/goals/what`);
    } else {
      setLoading(false);
    }
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleRegenerateAi = async () => {
    setLoading(true);
    await generateWhyGoals();
    window.location.reload();
  };
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-2">What is your WHY?</h3>
        <div className="text-sm  mb-8">
          Remember that your whole campaign will always connect back to your{' '}
          <strong>why</strong>
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
      {loading && (
        <LoadingAnimation label="Creating your next step..." fullPage />
      )}
    </OnboardingWrapper>
  );
}
