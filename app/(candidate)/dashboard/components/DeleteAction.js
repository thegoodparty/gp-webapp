'use client';
import ErrorButton from '@shared/buttons/ErrorButton';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

async function handleDeleteHistory(id) {
  try {
    const api = gpApi.campaign.UpdateHistory.delete;
    const payload = {
      id,
    };
    const resp = await gpFetch(api, payload);
    return resp;
  } catch (e) {
    console.log('error', e);
  }
  return false;
}

export default function DeleteAction({
  id,
  setShowMenu,
  deleteHistoryCallBack,
  description,
}) {
  const [showDelete, setShowDelete] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDelete = async () => {
    setShowMenu(0);
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting...',
        isError: false,
      };
    });
    const deleteResp = await handleDeleteHistory(id);
    if (deleteResp) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Deleted',
          isError: false,
        };
      });
    }
    // window.location.reload();
    await deleteHistoryCallBack();
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
          <span className="whitespace-nowrap">Delete</span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        redButton={false}
        title="Delete Campaign Action"
        description={description}
        handleProceed={handleDelete}
        proceedLabel="Delete"
      />
    </>
  );
}
