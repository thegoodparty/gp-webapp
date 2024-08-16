'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import RadioList from '@shared/inputs/RadioList';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Paper from '@shared/utils/Paper';
import {
  createCampaign,
  updateUserMeta,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      await updateUserMeta({ accountType: 'browsing' });
      router.push('/browsing');
    }
  };
  return (
    <CardPageWrapper>
      <div className="text-center mb-8 pt-8">
        <H1>Which best describes you?</H1>
        <Body2 className="mt-3">
          This helps us determine your account type. <br />
          (Don&apos;t worry, you can change this later.)
        </Body2>
      </div>
      <RadioList
        options={options}
        selected={selected}
        selectCallback={setSelected}
      />

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
    </CardPageWrapper>
  );
}
