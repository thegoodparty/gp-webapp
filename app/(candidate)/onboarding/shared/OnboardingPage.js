'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { getUserCookie } from 'helpers/cookieHelper';
import ReactLoading from 'react-loading';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

export default function OnboardingPage({
  inputFields,
  campaign,
  campaignKey,
  reGenerateAiCallback,
  nextPath,
  nextPathFunc,
  slug,
  ...props
}) {
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

  if (campaign?.[campaignKey]) {
    keys.forEach((key) => {
      if (campaign[campaignKey][key]) {
        initialState[key] = campaign[campaignKey][key];
      }
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
        if (field.validate) {
          return field.validate(state[field.key]);
        }
      }
    }
    return true;
  };

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

  const canShowField = (field) => {
    const { showKey, showCondition } = field;
    return showCondition.includes(state[showKey]);
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="max-w-[360px] mx-auto">
          <div className="grid grid-cols-12 gap-4">
            {inputFields.map((field) => (
              <>
                {(!field.hidden || canShowField(field)) && (
                  <RenderInputField
                    field={field}
                    onChangeCallback={onChangeField}
                    error={!!errors[field.key]}
                    positions={props.positions}
                    value={state[field.key]}
                  />
                )}
              </>
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
            {loading ? (
              <ReactLoading color="green" />
            ) : (
              <BlackButtonClient
                onClick={handleSave}
                disabled={!canSave()}
                type="submit"
              >
                <div>NEXT</div>
              </BlackButtonClient>
            )}
          </div>
        </div>
      </form>
    </OnboardingWrapper>
  );
}
