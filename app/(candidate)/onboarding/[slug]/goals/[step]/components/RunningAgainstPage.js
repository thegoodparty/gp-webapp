'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import TextField from '@shared/inputs/TextField';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';
import { Select } from '@mui/material';
import { launchCampaign } from 'app/candidate/[slug]/components/ReviewBanner';

const partyOptions = [
  'Independent',
  'Democrat Party',
  'Republican Party',
  'Green Party',
  'Libertarian Party',
  'Forward Party',
  'Other',
];

export default function RunningAgainstPage({
  campaign,
  slug,
  header,
  subHeader,
  subSectionKey,
  ...props
}) {
  useEffect(() => {
    savingState.set(() => false);
  }, []);
  let initialState = {
    runningAgainst: [],
    newName: '',
    newDesc: '',
    newParty: '',
  };
  const shortVersion = !!campaign?.details?.filedStatement;
  if (campaign?.[subSectionKey]?.runningAgainst) {
    initialState.runningAgainst = campaign[subSectionKey].runningAgainst;
  }
  const [state, setState] = useState(initialState);
  const router = useRouter();

  const canSave = () => {
    if (
      state.newName !== '' &&
      (state.newDesc === '' || state.newParty === '')
    ) {
      return false;
    }

    if (
      state.newDesc !== '' &&
      (state.newName === '' || state.newParty === '')
    ) {
      return false;
    }

    if (
      state.newParty !== '' &&
      (state.newName === '' || state.newDesc === '')
    ) {
      return false;
    }

    if (
      state.newName === '' &&
      state.newDesc === '' &&
      state.newParty === '' &&
      state.runningAgainst.length === 0
    ) {
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    let newAgainst = [...state.runningAgainst];
    if (state.newName && state.newDesc) {
      newAgainst.push({
        name: state.newName,
        description: state.newDesc,
        party: state.newParty,
      });
    }

    updated[subSectionKey].runningAgainst = newAgainst;
    // updated.campaignPlan = false;
    // updated.campaignPlanStatus = false;

    await updateCampaign(updated);

    if (shortVersion) {
      // launch then redirect to dashboard.
      await launchCampaign();
      setTimeout(() => {
        window.location.href = '/dashboard/plan';
      }, 200);
    } else {
      savingState.set(() => true);
      setTimeout(() => {
        router.push(`/onboarding/${slug}/campaign-plan`);
      }, 200);
    }
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleAddAnother = () => {
    if (state.newName === '' || state.newDesc === '' || state.newParty === '') {
      return;
    }
    const newAgainst = state.runningAgainst;
    newAgainst.push({
      name: state.newName,
      description: state.newDesc,
      party: state.newParty,
    });

    setState({
      runningAgainst: newAgainst,
      newName: '',
      newDesc: '',
      newParty: '',
    });
  };

  const removeAgainst = (index) => {
    const newAgainst = state.runningAgainst;
    newAgainst.splice(index, 1);
    onChangeField('runningAgainst', newAgainst);
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <div className="max-w-[460px] mx-auto">
        {state.runningAgainst?.map((against, index) => (
          <div
            className="my-6 border-b border-gray-200 pb-3"
            key={against.name}
          >
            <div className="font-bold mb-2">{against.name}</div>
            <div>{against.party}</div>
            <div>{against.description}</div>

            <div
              className="mt-4 underline text-blue-600 cursor-pointer"
              onClick={() => {
                removeAgainst(index);
              }}
            >
              Remove
            </div>
          </div>
        ))}
        <TextField
          label="Name"
          fullWidth
          required
          value={state.newName}
          onChange={(e) => {
            onChangeField('newName', e.target.value);
          }}
        />
        <div className="mt-6">
          <Select
            native
            value={state.newParty}
            label="Opponent Party affiliation"
            fullWidth
            required
            variant="outlined"
            onChange={(e) => {
              onChangeField('newParty', e.target.value);
            }}
          >
            <option value="">Select Opponent Party</option>
            {partyOptions.map((op) => (
              <option value={op} key={op}>
                {op}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-6">
          <TextField
            label="Describe them"
            placeholder="EXAMPLE: Republican hotel owner"
            multiline
            rows={6}
            fullWidth
            required
            value={state.newDesc}
            onChange={(e) => {
              onChangeField('newDesc', e.target.value);
            }}
          />
        </div>
        <div
          className="mt-4 underline text-blue-600 cursor-pointer"
          onClick={handleAddAnother}
        >
          Add Another
        </div>
        <div className="flex justify-center  my-8">
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            <div>
              {shortVersion ? 'VIEW DASHBOARD' : 'GENERATE CAMPAIGN PLAN'}
            </div>
          </BlackButtonClient>
        </div>
      </div>
    </OnboardingWrapper>
  );
}
