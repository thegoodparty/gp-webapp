'use client';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { FaCopy } from 'react-icons/fa';
import { Button } from '@mui/material';

async function duplicateContent(key) {
  try {
    const api = gpApi.campaign.onboarding.adminDuplicate;
    const payload = {
      key,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function DuplicateAction({ key }) {
  const [showDuplicate, setShowDuplicate] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDuplicate = async () => {

      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Duplicating...',
          isError: false,
        };
      });

    //   snackbarState.set(() => {
    //     return {
    //       isOpen: true,
    //       message: 'Duplicated',
    //       isError: false,
    //     };
    //   });
    // await duplicateContent(key);
    // await revalidateContent();
    // await revalidatePage('/admin/candidates');
    // window.location.reload();
  };

  return (
    <>
    <Button onClick={() => setShowDuplicate(true)}>
        <span
        className="text-gray-800 hover:text-slate-50 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3"
        >
        <div
            className="whitespace-nowrap text-lg flex items-center w-full"
        >
            <FaCopy className="text-[14px]" />
            <div className="ml-3 font-sfpro text-[17px]">Duplicate</div>
        </div>
        </span>
    </Button>

    <AlertDialog
        open={showDuplicate}
        handleClose={() => {
            setShowDuplicate(false);
        }}
        title={'Duplicate Content'}
        description={`Are you sure you want to duplicate this content?`}
        handleProceed={handleDuplicate}
    />
    </>
  );
}
