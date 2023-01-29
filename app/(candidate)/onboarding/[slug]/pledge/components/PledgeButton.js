'use client';

import Checkbox from '@mui/material/Checkbox';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
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
  const router = useRouter();
  const handleSubmit = async () => {
    if (checked) {
      const updated = { ...campaign, pledge: true };
      await updateCampaign(updated);
      router.push(`onboarding/${slug}/goals/why`);
    }
  };
  return (
    <>
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
    </>
  );
}
