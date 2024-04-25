'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import PhoneInput from '@shared/inputs/PhoneInput';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

async function updateUser(phone) {
  try {
    const api = gpApi.user.updateUser;
    const payload = {
      phone,
    };

    const response = await gpFetch(api, payload);
    const { user } = response;
    setUserCookie(user);
  } catch (error) {
    console.log('Error updating user', error);
  }
}

export default function PhoneStep(props) {
  const { campaign, step } = props;
  const router = useRouter();
  const [state, setState] = useState({
    phone: campaign?.details?.phone || '',
    error: false,
  });
  const onChangeField = (phone, isValid) => {
    setState({
      phone,
      error: !isValid,
    });
  };

  const handleSave = async () => {
    if (!state.error) {
      const currentStep = onboardingStep(campaign, step);

      await updateCampaign([
        { 'details.phone': state.phone, 'data.currentStep': currentStep },
      ]);
      await updateUser(state.phone);
      router.push(`/onboarding/${campaign.slug}/${step + 1}`);
    }
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col text-center py-12">
        <H1>
          Hi, I&apos;m your AI
          <br />
          Campaign Manager
        </H1>
        <Body1 className="mt-8 mb-10">
          I just need a little bit of information to get you started. Don&apos;t
          worry, your personal information is safe with us and will never be
          shared.
        </Body1>
        <div className="w-full max-w-md">
          <PhoneInput
            value={state.phone}
            required
            onChangeCallback={(phone, isValid) => {
              onChangeField(phone, isValid);
            }}
            hideIcon
            shrink
          />
        </div>
        <div className="mt-10" onClick={handleSave}>
          <PrimaryButton
            disabled={state.error || state.phone === ''}
            type="submit"
          >
            Next
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
