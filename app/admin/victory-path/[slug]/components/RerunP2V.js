'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidatePage } from 'helpers/cacheHelper';
import SuccessButton from '@shared/buttons/SuccessButton';
import { useState } from 'react';
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign';
import { useSnackbar } from 'helpers/useSnackbar';

async function rerunP2V(slug) {
  try {
    const api = gpApi.voterData.pathToVictory;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function RerunP2V() {
  const [campaign, _, refreshCampaign] = useAdminCampaign();
  const [processing, setProcessing] = useState(false);
  const { successSnackbar, errorSnackbar } = useSnackbar();

  const handleRerun = async () => {
    if (processing) return;
    setProcessing(true);
    const response = await rerunP2V(campaign.slug);
    if (response) {
      successSnackbar('Path to victory rerun');
      await revalidatePage('/admin/victory-path/[slug]');
      refreshCampaign();
    } else {
      errorSnackbar('Error rerunning path to victory');
      setProcessing(false);
    }
  };

  return (
    <div className="my-4" onClick={handleRerun}>
      <SuccessButton disabled={processing}>Rerun Path to Victory</SuccessButton>
    </div>
  );
}
