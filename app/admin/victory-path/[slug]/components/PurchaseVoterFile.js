'use client';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidatePage } from 'helpers/cacheHelper';
import SuccessButton from '@shared/buttons/SuccessButton';
import { useState } from 'react';
import WarningButton from '@shared/buttons/WarningButton';
import VoteAnimation from '@shared/animations/VoteAnimation';

async function purchaseFile(slug) {
  try {
    const api = gpApi.voterData.purchaseVoterFile;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function countFile(slug) {
  try {
    const api = gpApi.voterData.count;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function PurchaseVoterFile(props) {
  const { campaign } = props;
  const [processing, setProcessing] = useState(false);
  const [count, setCount] = useState(false);

  const snackbarState = useHookstate(globalSnackbarState);

  const handlePurchase = async () => {
    if (processing) return;
    setProcessing(true);
    const response = await purchaseFile(campaign.slug);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Voter file purchased',
          isError: false,
        };
      });
      await revalidatePage('/admin/victory-path/[slug]');
      setProcessing(false);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error purchasing voter file',
          isError: true,
        };
      });
      setProcessing(false);
    }
  };

  const handleCount = async () => {
    if (processing) return;
    setProcessing(true);
    const response = await countFile(campaign.slug);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Counting Voters',
          isError: false,
        };
      });
      const { count } = response;
      setCount(count);
      setProcessing(false);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error counting voters',
          isError: true,
        };
      });
      setCount(false);
      setProcessing(false);
    }
  };

  return (
    <>
      {count !== false ? (
        <div className="my-4 border border-slate-300 rounded p-3">
          <div className="text-lg">
            Voter count: <strong>{count}</strong>
          </div>
        </div>
      ) : null}
      <div className="items-center mt-4 flex">
        <SuccessButton disabled={processing} onClick={handlePurchase}>
          Purchase Voter File
        </SuccessButton>
        <div className="ml-4">
          <WarningButton disabled={processing} onClick={handleCount}>
            Count Voters (without purchasing)
          </WarningButton>
        </div>
        {processing ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[1201] flex items-center justify-center bg-black bg-opacity-25">
            <div className="w-64 h-64">
              <VoteAnimation loop />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
