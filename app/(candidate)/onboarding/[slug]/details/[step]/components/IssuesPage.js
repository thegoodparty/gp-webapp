'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import ReactLoading from 'react-loading';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PositionsSelector from 'app/(candidate)/onboarding/components/PositionsSelector';
import TextField from '@shared/inputs/TextField';

export default function IssuesPage({
  campaign,
  nextPath,
  slug,
  header,
  subHeader,
  positions,
  campaignKey,
  ...props
}) {
  let initialState = {
    positions: [],
  };
  const keys = ['positions'];
  if (campaign?.[campaignKey]?.topIssues) {
    initialState = campaign[campaignKey].topIssues;
  }
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canSave = () => {
    if (!state.positions || state.positions.length === 0) {
      return false;
    }
    for (let i = 0; i < state.positions.length; i++) {
      const id = positions[i].id;
      if (!state[`position-${id}`] || state[`position-${id}`] === '') {
        return false;
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

    updated[campaignKey].topIssues = state;
    await updateCampaign(updated);
    let path = nextPath;

    router.push(`onboarding/${slug}${path}`);
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
      <div className="max-w-[360px] mx-auto">
        <div>
          <PositionsSelector
            positions={positions}
            updateCallback={(positions) => onChangePositions(positions)}
            initialSelected={state.positions}
            square
          />
        </div>
        {state.positions?.map((position) => (
          <div className="mt-6 mb-10">
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

        <div className="flex justify-center">
          {loading ? (
            <ReactLoading color="green" />
          ) : (
            <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
              <div>NEXT</div>
            </BlackButtonClient>
          )}
        </div>
      </div>
    </OnboardingWrapper>
  );
}
