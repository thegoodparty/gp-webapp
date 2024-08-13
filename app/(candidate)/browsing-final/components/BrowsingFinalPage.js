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

const options = [
  {
    key: 'matthew',
    label: 'Matthew McConaughey',
  },
  {
    key: 'taylor',
    label: 'Taylor Swift',
  },
];

export default function BrowsingFinalPage() {
  const [selected, setSelected] = useState(false);
  const [_, _2, refreshCampaign] = useCampaign();

  const handleNext = async () => {
    await updateUserMeta({ demoPersona: selected });
    await createDemoCampaign();
    await refreshCampaign();
  };

  return (
    <CardPageWrapper>
      <div className="text-center mb-8 pt-8">
        <H1>One final question...</H1>
        <Body2 className="mt-3">
          Please select who you&apos;d like to portray on your demo account:
        </Body2>
      </div>
      <RadioList
        options={options}
        selected={selected}
        selectCallback={setSelected}
      />

      <div className="flex items-center justify-between mt-12">
        <Link href="/browsing">
          <SecondaryButton>
            <div className="min-w-[120px]">Back</div>
          </SecondaryButton>
        </Link>
        <Link disabled={!selected} href="/browsing-welcome">
          <PrimaryButton disabled={!selected} onClick={handleNext}>
            <div className="min-w-[120px]">Next</div>
          </PrimaryButton>
        </Link>
      </div>
    </CardPageWrapper>
  );
}
