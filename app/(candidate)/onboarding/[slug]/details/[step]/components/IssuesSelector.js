'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useEffect, useState } from 'react';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PositionsSelector from 'app/(candidate)/onboarding/shared/PositionsAutocomplete';
import TextField from '@shared/inputs/TextField';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';

export default function IssuesSelector({
  campaign,
  positions,
  subSectionKey,
  onSaveCallback,
  buttonLabel = 'NEXT',
  candidate,
}) {
  const positionsWithOther = [...positions];
  useEffect(() => {
    savingState.set(() => false);
  }, []);
  let initialState = {
    positions: [],
  };
  if (campaign?.[subSectionKey]?.topIssues) {
    initialState = campaign[subSectionKey].topIssues;
  }
  const [state, setState] = useState(initialState);

  const canSave = () => {
    if (!state.positions || state.positions.length < 3) {
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
    onSaveCallback();
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

  const addCustom = () => {
    const updated = [
      ...state.positions,
      {
        id: 'custom-id',
        name: 'Custom Issue',
        topIssue: { name: 'Other' },
      },
    ];

    onChangeField('positions', updated);
  };

  return (
    <>
      <div className="max-w-[460px] mx-auto">
        <div>
          <PositionsSelector
            positions={positionsWithOther}
            updateCallback={(positions) => onChangePositions(positions)}
            initialSelected={state.positions}
            square
          />
        </div>
        <div
          className="my-5 font-bold text-blue-500 cursor-pointer"
          onClick={addCustom}
        >
          Add your custom Issue
        </div>
        {state.positions?.map((position) => (
          <>
            {position && (
              <div className="mt-6 mb-10" key={position?.name}>
                Tell us your stance on {position?.name} (
                {position?.topIssue?.name})
                <div>
                  <TextField
                    placeholder="Write here..."
                    multiline
                    rows={6}
                    fullWidth
                    value={state[`position-${position?.id}`]}
                    error={state[`position-${position?.id}`] === ''}
                    onChange={(e) => {
                      onChangeField(`position-${position?.id}`, e.target.value);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ))}
        <div className="flex justify-center  mb-4">
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            <div className="font-black">{buttonLabel}</div>
          </BlackButtonClient>
        </div>
        {!state.positions ||
          (state.positions.length < 3 && (
            <div className="text-red-600 text-center  mb-4">
              Add {state.positions.length === 0 && 'three'}
              {state.positions.length === 1 && 'two'}
              {state.positions.length === 2 && 'one'} more issue
              {state.positions.length < 2 && 's'} to advance to next step.
            </div>
          ))}
      </div>
    </>
  );
}
