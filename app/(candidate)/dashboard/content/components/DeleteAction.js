'use client';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { FaTrashAlt } from 'react-icons/fa';
import { Button } from '@mui/material';

async function deleteContent(key) {
  try {
    const api = gpApi.campaign.onboarding.adminDelete;
    const payload = {
      key,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function DeleteAction({ key }) {
  const [showDelete, setShowDelete] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDelete = async () => {

      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Deleting...',
          isError: false,
        };
      });

    //   snackbarState.set(() => {
    //     return {
    //       isOpen: true,
    //       message: 'Deleted',
    //       isError: false,
    //     };
    //   });
    // await deleteContent(key);
    // await revalidateContent();
    // await revalidatePage('/admin/candidates');
    // window.location.reload();
  };

  return (
    <>
      <Button onClick={() => setShowDelete(true)}>
        <span
          className="text-red-400 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3"
        >
          <div
            className="whitespace-nowrap text-lg flex items-center w-full"
          >
            <FaTrashAlt className="text-[14px]" />
            <div className="ml-3 font-sfpro text-[17px]">Delete</div>
          </div>
        </span>
      </Button>

      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        title={'Delete Content'}
        description={`Are you sure you want to delete this content? This cannot be undone.`}
        handleProceed={handleDelete}
      />
    </>
  );
}
