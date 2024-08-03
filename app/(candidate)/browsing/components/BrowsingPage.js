'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import RadioList from '@shared/inputs/RadioList';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Paper from '@shared/utils/Paper';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

export default function BrowsingPage() {
  const [selected, setSelected] = useState('considering');
  const router = useRouter();

  const handleNext = async () => {
    if (selected === 'running') {
      await createCampaign();
    } else if (selected === 'browsing') {
      router.push('/browsing');
    }
  };
  return (
    <div className="bg-indigo-100">
      <MaxWidth>
        <div className="flex items-center justify-center">
          <div className="grid py-6 max-w-2xl w-[75vw]">
            <Paper className="p-5 md:p-8 lg:p-12">
              <div className="text-center mb-8 pt-8">
                <H1>We&apos;re excited to have you exploring GoodParty.org!</H1>
                <Body2 className="mt-3">
                  To help us make your experience even better, could you let us
                  know why you&apos;re just browsing?
                </Body2>
              </div>
              <RadioList
                options={options}
                selected={selected}
                selectCallback={setSelected}
              />

              <div className="flex items-center justify-between mt-12">
                <Link href="/account-type">
                  <SecondaryButton>
                    <div className="min-w-[120px]">Back</div>
                  </SecondaryButton>
                </Link>
                <PrimaryButton onClick={handleNext}>
                  <div className="min-w-[120px]">Next</div>
                </PrimaryButton>
              </div>
            </Paper>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
