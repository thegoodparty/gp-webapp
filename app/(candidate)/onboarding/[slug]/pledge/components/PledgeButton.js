'use client';

import Checkbox from '@mui/material/Checkbox';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export async function updateCampaign(campaign) {
  try {
    const api = gpApi.campaign.onboarding.update;
    return await gpFetch(api, { campaign });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function PledgeButton({ slug, campaign, content }) {
  const [checked, setChecked] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (checked) {
      setLoading(true);
      const updated = { ...campaign, pledge: true };
      const res = await updateCampaign(updated);
      if (res) {
        router.push(`onboarding/${slug}/goals/why`);
      } else {
        setLoading(false);
      }
    }
  };
  return (
    <div>
      <div className="mt-16 flex items-center text-xl font-bold mb-4">
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        &nbsp; &nbsp; {content.cta}
      </div>
      <BlackButtonClient
        className="font-black"
        disabled={!checked}
        onClick={handleSubmit}
      >
        Continue
      </BlackButtonClient>
      {loading && (
        <LoadingAnimation
          label="Creating your goals and objectives..."
          fullPage
        />
      )}
    </div>
  );
}
