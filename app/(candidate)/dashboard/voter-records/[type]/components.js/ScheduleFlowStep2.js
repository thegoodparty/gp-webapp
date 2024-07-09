'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import CustomVoterAudienceFilters from '../../components/CustomVoterAudienceFilters';
import { useState } from 'react';
import { countVoterFile } from './RecordCount';
import { numberFormatter } from 'helpers/numberHelper';

export default function ScheduleFlowStep2({
  onChangeCallback,
  nextCallback,
  backCallback,
  type,
  withVoicemail,
}) {
  const [state, setState] = useState({});
  const [count, setCount] = useState(0);

  const handleChangeAudience = async (newState) => {
    onChangeCallback('audience', newState);
    setState(newState);
    const selectedAudience = Object.keys(newState).filter(
      (key) => newState[key],
    );
    const res = await countVoterFile('custom', { filters: selectedAudience });
    setCount(res?.count);
  };

  const canContinue = () => {
    return count !== 0 && Object.values(state).some((value) => value);
  };
  let isTel = type === 'telemarketing';
  let price = 0.03;
  if (type === 'telemarketing') {
    price = 0.04;
    if (withVoicemail) {
      price = 0.55;
    }
  }
  return (
    <div className="p-4 w-[90vw] max-w-4xl">
      <div className="text-center">
        <H1>Who would you like to {isTel ? 'call' : 'text'}?</H1>
        <Body1 className="mt-4 mb-4">
          Select from the filters below to begin calculating your costs.
        </Body1>
        <div className="bg-neutral-background p-4 text-xs font-medium text-gray-600 uppercase">
          Your selection(s) Total{' '}
          <span className="font-bold text-black">
            {numberFormatter(count)} Records{' '}
            {withVoicemail ? '+ voicemails' : ''}
          </span>
          . AN Estimated cost of{' '}
          <span className="font-bold text-black">
            ${(numberFormatter(count) * price).toFixed(2)}
          </span>
        </div>
        <div className="text-left">
          <CustomVoterAudienceFilters onChangeCallback={handleChangeAudience} />
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
          </div>
          <div className="col-span-6 text-right mt-6">
            <PrimaryButton onClick={nextCallback} disabled={!canContinue()}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
