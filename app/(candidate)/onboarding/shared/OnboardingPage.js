'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PortalPanel from '@shared/layouts/PortalPanel';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { getUserCookie } from 'helpers/cookieHelper';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import { updateCampaign } from '../[slug]/pledge/components/PledgeButton';

export default function OnboardingPage({
  inputFields,
  campaign,
  campaignKey,
  reGenerateAiCallback,
  nextPath,
  nextPathFunc,
  slug,
  header,
  subHeader,
  ...props
}) {
  console.log('onboarding page1');
  const initialState = {};
  const keys = [];

  inputFields.map((field) => {
    console.log('onboarding page2', field);
    if (field.initialValue) {
      initialState[field.key] = field.initialValue;
    } else {
      initialState[field.key] = '';
    }
    keys.push(field.key);
  });
  console.log('onboarding page3');

  if (campaign?.[campaignKey]) {
    console.log('onboarding page4');
    keys.forEach((key) => {
      initialState[key] = campaign[campaignKey][key];
    });
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const user = getUserCookie(true);
  const [loading, setLoading] = useState(false);

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
  console.log('onboarding page5');

  const handleSave = async () => {
    setLoading(true);
    const updated = campaign;
    if (!updated[campaignKey]) {
      updated[campaignKey] = {};
    }
    keys.forEach((key) => {
      updated[campaignKey][key] = state[key];
    });
    await updateCampaign(updated);
    let path = nextPath;
    if (!path && nextPathFunc) {
      path = nextPathFunc({ ...state });
    }

    router.push(`onboarding/${slug}${path}`);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleRegenerateAi = async () => {
    setLoading(true);
    await reGenerateAiCallback();
    window.location.reload();
  };
  console.log('onboarding page6', slug);
  return (
    <OnboardingWrapper {...props} slug={slug}>
      <div className="grid grid-cols-12 gap-4">
        {inputFields.map((field) => (
          <RenderInputField
            field={field}
            onChangeCallback={onChangeField}
            error={!!errors[field.key]}
            positions={props.positions}
            value={state[field.key]}
          />
        ))}
      </div>

      <div className="flex justify-center">
        {user?.isAdmin && reGenerateAiCallback && (
          <div className="mr-6">
            <BlackButtonClient
              onClick={handleRegenerateAi}
              style={{ backgroundColor: 'blue' }}
            >
              <div className="font-black">Regenerate AI input (Admin)</div>
            </BlackButtonClient>
          </div>
        )}
        <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
          <div>NEXT</div>
        </BlackButtonClient>
      </div>
      {loading && <LoadingAnimation label="Generating responses" fullPage />}
    </OnboardingWrapper>
  );
}
