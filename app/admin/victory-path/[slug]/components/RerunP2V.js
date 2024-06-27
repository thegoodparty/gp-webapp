'use client';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidatePage } from 'helpers/cacheHelper';
import SuccessButton from '@shared/buttons/SuccessButton';
import { useState } from 'react';
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign';

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

  const snackbarState = useHookstate(globalSnackbarState);

  const handleRerun = async () => {
    if (processing) return;
    setProcessing(true);
    const response = await rerunP2V(campaign.slug);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Path to victory rerun',
          isError: false,
        };
      });
      await revalidatePage('/admin/victory-path/[slug]');
      refreshCampaign();
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error rerunning path to victory',
          isError: true,
        };
      });
      setProcessing(false);
    }
  };

  return (
    <div className="my-4" onClick={handleRerun}>
      <SuccessButton disabled={processing}>Rerun Path to Victory</SuccessButton>
    </div>
  );
}
