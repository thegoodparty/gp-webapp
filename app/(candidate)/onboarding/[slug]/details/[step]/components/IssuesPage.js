'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PositionsSelector from 'app/(candidate)/onboarding/shared/PositionsSelector';
import TextField from '@shared/inputs/TextField';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';

export default function IssuesPage({
  campaign,
  nextPath,
  slug,
  header,
  subHeader,
  positions,
  subSectionKey,
  ...props
}) {
  console.log('positions', positions);
  const positionsWithOther = [
    ...positions,
    {
      name: 'Important Issue',
      topIssue: { name: 'Other' },
    },
  ];
  useEffect(() => {
    savingState.set(() => false);
  }, []);
  let initialState = {
    positions: [],
  };
  const keys = ['positions'];
  if (campaign?.[subSectionKey]?.topIssues) {
    initialState = campaign[subSectionKey].topIssues;
  }
  const [state, setState] = useState(initialState);
  const router = useRouter();

  const canSave = () => {
    if (!state.positions || state.positions.length === 0) {
      return false;
    }
    for (let i = 0; i < state.positions.length; i++) {
      const id = state.positions[i].id;
      if (!state[`position-${id}`] || state[`position-${id}`] === '') {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    updated[subSectionKey].topIssues = state;
    await updateCampaign(updated);
    let path = nextPath;

    savingState.set(() => true);

    setTimeout(() => {
      router.push(`onboarding/${slug}${path}`);
    }, 200);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const onChangePositions = (positions) => {
    onChangeField('positions', positions);
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <div className="max-w-[460px] mx-auto">
        <div>
          <PositionsSelector
            positions={positionsWithOther}
            updateCallback={(positions) => onChangePositions(positions)}
            initialSelected={state.positions}
            square
          />
        </div>
        {state.positions?.map((position) => (
          <div className="mt-6 mb-10" key={position.name}>
            Tell us your stance on {position.name} ({position.topIssue?.name})
            <div>
              <TextField
                placeholder="Write here..."
                multiline
                rows={6}
                fullWidth
                value={state[`position-${position.id}`]}
                onChange={(e) => {
                  onChangeField(`position-${position.id}`, e.target.value);
                }}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-center  mb-8">
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            <div>NEXT</div>
          </BlackButtonClient>
        </div>
      </div>
    </OnboardingWrapper>
  );
}
