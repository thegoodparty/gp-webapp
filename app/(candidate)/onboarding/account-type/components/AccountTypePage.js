'use client';
import Button from '@shared/buttons/Button';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import RadioList from '@shared/inputs/RadioList';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import {
  createCampaign,
  updateUserMeta,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const options = [
  { key: 'running', label: 'Currently running for office' },
  { key: 'managing', label: 'Managing a campaign' },
  { key: 'browsing', label: 'Just browsing' },
];

export default function AccountTypePage() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('running');
  const router = useRouter();

  const handleNext = async () => {
    setLoading(true);
    switch (selected) {
      case 'running':
        await createCampaign();
        break;
      case 'browsing':
        await updateUserMeta({ accountType: 'browsing' });
        router.push('/onboarding/browsing');
        break;
      case 'managing':
        await updateUserMeta({ accountType: 'managing' });
        router.push('/onboarding/managing/candidate-lookup');
        break;
    }
    setLoading(false);
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

      <div className="flex flex-wrap items-center justify-between mt-12">
        <Button
          href="/"
          size="large"
          color="neutral"
          className="w-full mb-4 md:w-auto md:mb-auto min-w-[120px]"
        >
          Cancel
        </Button>
        <Button
          size="large"
          loading={loading}
          disabled={loading}
          className="w-full mb-4 md:w-auto md:mb-auto min-w-[120px]"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </CardPageWrapper>
  );
}
