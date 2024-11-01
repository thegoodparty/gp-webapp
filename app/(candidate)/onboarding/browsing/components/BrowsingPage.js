'use client';
import Button from '@shared/buttons/Button';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import RadioList from '@shared/inputs/RadioList';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import { updateUserMeta } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const options = [
  {
    key: 'considering',
    label: "I'm not running, but am actively considering to run in the future",
  },
  {
    key: 'learning',
    label:
      "I'm interested in learning about GoodParty.org, but don't intend to run",
  },
  {
    key: 'test',
    label: 'I want to test out your tools before making a decision',
  },
  {
    key: 'else',
    label: 'Something else',
  },
];

export default function BrowsingPage({ metaData }) {
  const [selected, setSelected] = useState('considering');
  const router = useRouter();

  useEffect(() => {
    if (metaData?.whyBrowsing) {
      setSelected(metaData.whyBrowsing);
    }
  }, [metaData]);

  const handleNext = async () => {
    await updateUserMeta({ whyBrowsing: selected });
    router.push('/onboarding/browsing/final');
  };
  return (
    <CardPageWrapper>
      <div className="text-center mb-8 pt-8">
        <H1>We&apos;re excited to have you exploring GoodParty.org!</H1>
        <Body2 className="mt-3">
          To help us make your experience even better, could you let us know why
          you&apos;re just browsing?
        </Body2>
      </div>
      <RadioList
        options={options}
        selected={selected}
        selectCallback={setSelected}
      />

      <div className="flex flex-wrap items-center justify-between mt-12">
        <Button
          className="w-full mb-4 md:w-auto md:mb-auto min-w-[170px]"
          href="/onboarding/account-type"
          size="large"
          color="neutral"
        >
          Back
        </Button>
        <Button
          className="w-full mb-4 md:w-auto md:mb-auto min-w-[170px]"
          onClick={handleNext}
          size="large"
        >
          Next
        </Button>
      </div>
    </CardPageWrapper>
  );
}
