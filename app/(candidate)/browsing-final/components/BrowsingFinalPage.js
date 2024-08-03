'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import RadioList from '@shared/inputs/RadioList';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Paper from '@shared/utils/Paper';
import { updateUserMeta } from 'app/(candidate)/onboarding/shared/ajaxActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const router = useRouter();

  const handleNext = async () => {
    // TODO: Matthew - start here
    // await updateUserMeta({ whyBrowsing: selected });
    // router.push('/browsing-final');
  };
  return (
    <div className="bg-indigo-100">
      <MaxWidth>
        <div className="flex items-center justify-center">
          <div className="grid py-6 max-w-2xl w-[75vw]">
            <Paper className="p-5 md:p-8 lg:p-12">
              <div className="text-center mb-8 pt-8">
                <H1>One final question...</H1>
                <Body2 className="mt-3">
                  Please select who you&apos;d like to portray on your demo
                  account:
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
