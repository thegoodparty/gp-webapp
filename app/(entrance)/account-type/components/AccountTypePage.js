'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Paper from '@shared/utils/Paper';
import { Primary } from '@storybook/blocks';
import { createCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const options = [
  { key: 'running', label: 'Currently running for office' },
  // { key: 'supporting', label: 'Supporting a candidate' },
  { key: 'browsing', label: 'Just browsing' },
];

export default function AccountTypePage() {
  const [selected, setSelected] = useState('running');
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
                <H1>Which best describes you?</H1>
                <Body2 className="mt-3">
                  This helps us determine your account type. <br />
                  (Don&apos;t worry, you can change this later.)
                </Body2>
              </div>
              {options.map((option) => (
                <Fragment key={option.key}>
                  {selected === option.key ? (
                    <div
                      key={option.key}
                      className="mb-4 flex items-center  py-4 px-6 rounded-lg  p-4 cursor-pointer bg-tertiary-main text-white"
                      onClick={() => setSelected(option.key)}
                    >
                      <MdRadioButtonChecked size={22} />
                      <div className="ml-2">{option.label}</div>
                    </div>
                  ) : (
                    <div
                      key={option.key}
                      className="mb-4 flex items-center  py-4 px-6 rounded-lg  p-4 cursor-pointer border border-gray-300"
                      onClick={() => setSelected(option.key)}
                    >
                      <MdRadioButtonUnchecked size={22} />
                      <div className="ml-2">{option.label}</div>
                    </div>
                  )}
                </Fragment>
              ))}
              <div className="flex items-center justify-between mt-12">
                <Link href="/">
                  <SecondaryButton>
                    <div className="min-w-[120px]">Cancel</div>
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
