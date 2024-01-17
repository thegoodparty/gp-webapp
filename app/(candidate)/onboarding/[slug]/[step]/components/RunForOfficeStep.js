'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import PhoneInput from '@shared/inputs/PhoneInput';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RunForOfficeStep(props) {
  const { campaign, step } = props;
  console.log('campaign', campaign);
  const router = useRouter();
  const [state, setState] = useState({
    runForOffice: campaign?.details?.runForOffice || '',
    error: false,
  });
  const onChangeField = (key, value) => {
    setState({
      [key]: value,
    });
  };

  const handSave = async () => {
    if (!state.error) {
      const updated = {
        ...campaign,
        currentStep: campaign.currentStep
          ? Math.max(campaign.currentStep, step)
          : step,
        details: {
          ...campaign.details,
          runForOffice: state.runForOffice,
        },
      };
      await updateCampaign(updated);
      router.push(`/onboarding/${campaign.slug}/${step + 1}`);
    }
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col text-center py-12">
        <H1>Are you planning to run for office?</H1>

        <div className="w-full max-w-md"></div>
        <div className="mt-10" onClick={handSave}>
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
