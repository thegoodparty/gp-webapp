'use client';
import { FormControlLabel, Radio } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Checkbox from '@shared/inputs/Checkbox';
import RadioGroup from '@shared/inputs/RadioGroup';
import TextField from '@shared/inputs/TextField';
import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IoIosHelpCircle } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';

export default function RunForOfficeStep(props) {
  const { campaign, step } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false)
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
        currentStep: onboardingStep(campaign, step),
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
        <H1>Have you filed to run for office?</H1>
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
                label="Not yet"
              />
            </RadioGroup>
          </div>

          {state.runForOffice === 'yes' && (
            <div className="mt-10">
              <div className="flex justify-center items-center mb-6">
                <H3>
                  What&apos;s the name of your committee?
                </H3>
                <Tooltip
                  title="This is the official name you&apos;ve registered or will register your campaign under with the relevant electoral authorities. It&apos;s how your campaign is recognized for legal, financial, and reporting purposes. Commonly, it includes the candidate&apos;s name, office sought, and may include terms like &apos;Committee&apos;, &apos;Friends of&apos;, or &apos;Elect&apos;. For example, &apos;Friends of Jane Doe for Mayor&apos;. If you haven&apos;t registered yet, enter a provisional name you plan to use."
                  open={tooltipOpen}
                  onClick={() => setTooltipOpen(!tooltipOpen)}
                  onClose={() => setTooltipOpen(false)}
                >
                  <IconButton size="small">
                    <IoIosHelpCircle />
                  </IconButton>
                </Tooltip>
              </div>
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
