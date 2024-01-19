'use client';
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RunForOfficeStep(props) {
  const { campaign, step } = props;
  console.log('campaign', campaign);
  const router = useRouter();
  const [state, setState] = useState({
    runForOffice: campaign?.details?.runForOffice || null,
    campaignCommittee: campaign?.details?.campaignCommittee || '',
    noCommittee: campaign?.details?.noCommittee || false,
  });
  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return (
      state.runForOffice === 'no' ||
      (state.runForOffice === 'yes' &&
        state.campaignCommittee &&
        state.campaignCommittee !== '') ||
      (state.runForOffice === 'yes' && state.noCommittee)
    );
  };

  const handleSave = async () => {
    if (canSubmit) {
      const updated = {
        ...campaign,
        currentStep: campaign.currentStep
          ? Math.max(campaign.currentStep, step)
          : step,
        details: {
          ...campaign.details,
          ...state,
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
        <div className="w-full max-w-md">
          <div className="py-8 px-6 border-2 border-slate-200 rounded-lg mt-10">
            <RadioGroup
              row
              value={state.runForOffice}
              onChange={(e) => onChangeField('runForOffice', e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No, just exploring"
              />
            </RadioGroup>
          </div>

          {state.runForOffice === 'yes' && (
            <div className="mt-10">
              <H3 className="mb-6">What&apos;s the name of your committee?</H3>
              <TextField
                label="Committee Name"
                fullWidth
                value={state.campaignCommittee}
                onChange={(e) =>
                  onChangeField('campaignCommittee', e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div className="flex items-center justify-start mt-4">
                <Checkbox
                  value={state.noCommittee}
                  onChange={(e) =>
                    onChangeField('noCommittee', e.target.checked)
                  }
                />
                <div className="ml-1">I don&apos;t have one</div>
              </div>
            </div>
          )}
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
