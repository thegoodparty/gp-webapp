'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H1 from '@shared/typography/H1';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { validateZip } from 'app/(entrance)/login/components/LoginPage';
import TextField from '@shared/inputs/TextField';
import { updateUser } from 'helpers/userHelper';

export default function ZipStep(props) {
  const { campaign, step } = props;
  const router = useRouter();
  const [state, setState] = useState({
    zip: campaign?.details?.zip || '',
  });

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return validateZip(state.zip);
  };

  const handleSave = async () => {
    if (!canSubmit()) {
      return;
    }
    const currentStep = onboardingStep(campaign, step);
    const attr = [
      { key: 'details.zip', value: state.zip },
      { key: 'data.currentStep', value: currentStep },
    ];

    await updateCampaign(attr);
    await updateUser({ zip: state.zip });
    router.push(`/onboarding/${campaign.slug}/${step + 1}`);
  };

  const knowsRun = campaign?.details?.runForOffice === 'yes';

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col text-center py-12">
        <H1>
          {knowsRun
            ? 'What zip code are you running in?'
            : 'What zip code would you run in?'}
        </H1>

        <div className="w-full max-w-md mt-10">
          <TextField
            label="Zip code"
            fullWidth
            value={state.zip}
            onChange={(e) => onChangeField('zip', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            error={!validateZip(state.zip) && state.zip !== ''}
          />
        </div>
        <div className="mt-10" onClick={handleSave}>
          <PrimaryButton disabled={!canSubmit()} type="submit">
            Next
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
