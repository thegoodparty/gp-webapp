'use client';
import ErrorButton from '@shared/buttons/ErrorButton';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';

import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

async function deleteCandidate(id) {
  try {
    const api = gpApi.admin.deleteCandidate;
    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function DeleteAction({ id }) {
  const [showDelete, setShowDelete] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDelete = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'deleting candidate',
        isError: false,
      };
    });
    await deleteCandidate(id);
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleted',
        isError: false,
      };
    });
    setShowDelete(false);

    await revalidateCandidates();
    await revalidatePage('/admin/all-candidates');
    await revalidatePage('/admin/candidates');
    window.location.reload();
  };

  return (
    <>
      <div
        className="my-3"
        onClick={() => {
          setShowDelete(true);
        }}
      >
        <ErrorButton size="small" fullWidth>
          <span className="whitespace-nowrap">Delete Forever</span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        title="Delete candidate"
        description="Are you sure you want to delete this candidate? This cannot be undone."
        handleProceed={handleDelete}
      />
    </>
  );
}
