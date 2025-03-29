'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import CustomVoterAudienceFilters from '../../components/CustomVoterAudienceFilters';
import { useEffect, useState, useMemo } from 'react';
import { countVoterFile } from './RecordCount';
import { numberFormatter } from 'helpers/numberHelper';
import { debounce } from 'helpers/debounceHelper';
import { TRACKING_KEYS } from '../../components/CustomVoterAudienceFilters';

export default function ScheduleFlowAudienceStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  type,
  withVoicemail,
  audience,
  isCustom,
}) {
  const [count, setCount] = useState(0);
  const hasValues = useMemo(
    () => Object.values(audience).some((value) => value === true),
    [audience],
  );

  useEffect(() => {
    if (!hasValues) return;

    debounce(async () => {
      const selectedAudience = Object.keys(audience).filter(
        (key) => audience[key] === true,
      );
      const res = await countVoterFile(isCustom ? 'custom' : type, {
        filters: selectedAudience,
      });

      setCount(res);
    }, 300);
  }, [audience, isCustom, type, hasValues]);

  const handleChangeAudience = (newState) => {
    onChangeCallback('audience', newState);
  };

  let isTel = type === 'telemarketing';
  let price = 0.03;
  if (type === 'telemarketing') {
    price = 0.04;
    if (withVoicemail) {
      price = 0.055;
    }
  }

  return (
    <div className="p-4 w-[80vw] max-w-4xl">
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
            ${numberFormatter(count * price, 2)}
          </span>
        </div>
        <div className="text-left">
          <CustomVoterAudienceFilters
            trackingKey={TRACKING_KEYS.scheduleCampaign}
            showAudienceRequest
            audience={audience}
            onChangeCallback={handleChangeAudience}
          />
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
          </div>
          <div className="col-span-6 text-right mt-6">
            <PrimaryButton onClick={nextCallback} disabled={!hasValues}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
