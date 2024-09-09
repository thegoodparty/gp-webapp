'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import RadioList from '@shared/inputs/RadioList';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import {
  createDemoCampaign,
  updateUserMeta,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import Link from 'next/link';
import { useState } from 'react';
import { useCampaign } from '@shared/hooks/useCampaign';
import { trackEvent } from 'helpers/fullStoryHelper';

const options = [
  {
    key: 'matthew-mcconaughey',
    label: (
      <>
        <span className="font-bold">Demo a Local Office</span> (Eg. Mayor of
        Austin Texas)
      </>
    ),
  },
  {
    key: 'taylor-swift',
    label: (
      <>
        <span className="font-bold">Demo a Federal Office</span> (Eg. Senator of
        Tennessee)
      </>
    ),
  },
];

export default function BrowsingFinalPage() {
  const [selected, setSelected] = useState(false);
  const [_, _2, refreshCampaign] = useCampaign();

  const handleNext = async () => {
    await updateUserMeta({ demoPersona: selected });
    await createDemoCampaign();
    trackEvent('demo_onboarding_complete', { demoPersona: selected });
    await refreshCampaign();
  };

  return (
    <CardPageWrapper>
      <div className="text-center mb-8 pt-8">
        <H1>How would you like to demo GoodParty.org?</H1>
        <Body2 className="mt-3">
          Please select which office you&apos;d like to browse:
        </Body2>
      </div>
      <RadioList
        options={options}
        selected={selected}
        selectCallback={setSelected}
      />

      <div className="flex items-center justify-between mt-12">
        <Link href="/onboarding/browsing">
          <SecondaryButton>
            <div className="min-w-[120px]">Back</div>
          </SecondaryButton>
        </Link>
        <Link disabled={!selected} href="/onboarding/browsing/welcome">
          <PrimaryButton disabled={!selected} onClick={handleNext}>
            <div className="min-w-[120px]">Next</div>
          </PrimaryButton>
        </Link>
      </div>
    </CardPageWrapper>
  );
}
