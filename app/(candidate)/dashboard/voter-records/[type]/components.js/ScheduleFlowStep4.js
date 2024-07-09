'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { useState } from 'react';

export default function ScheduleFlowStep4({
  onChangeCallback,
  nextCallback,
  backCallback,
  submitCallback,
  fileName,
  type,
}) {
  const [state, setState] = useState({
    date: '',
    message: '',
  });

  const onChangeField = (key, value) => {
    const newState = {
      ...state,
      [key]: value,
    };
    setState(newState);
    onChangeCallback('schedule', newState);
  };

  const canSubmit = () => state.date != '' && state.message != '';

  const handleNext = () => {
    nextCallback();
    submitCallback();
  };
  const isTel = type === 'telemarketing';
  return (
    <div className="p-4 w-[90vw] max-w-xl">
      <div className="text-center">
        <H1>
          Schedule Campaign for:
          <br />
          <span className="text-tertiary">{fileName}</span>
        </H1>
        <Body1 className="mt-4 mb-8">
          Use the from below to schedule your{' '}
          {isTel ? 'phone banking' : 'texting'} campaign with our politics team.
          Please note that we require a minimum of 72 hours prior to the send
          date to coordinate your campaign.
        </Body1>

        <div className="mt-4">
          <TextField
            fullWidth
            label="Send date"
            type="date"
            required
            value={state.date}
            onChange={(e) => {
              onChangeField('date', e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Message"
            placeholder="Do you have any additional questions or asks?"
            multiline
            rows={5}
            fullWidth
            required
            value={state.newDesc}
            onChange={(e) => {
              onChangeField('message', e.target.value);
            }}
          />
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
          </div>
          <div className="col-span-6 text-right mt-6">
            <PrimaryButton onClick={handleNext} disabled={!canSubmit()}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
