'use client';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { useSnackbar } from 'helpers/useSnackbar';
import Button from '@shared/buttons/Button';

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
  const { successSnackbar } = useSnackbar();

  const handleDelete = async () => {
    setShowMenu(0);
    successSnackbar('Deleting...');
    const deleteResp = await handleDeleteHistory(id);
    if (deleteResp) {
      successSnackbar('Deleted');
    }
    // window.location.reload();
    await deleteHistoryCallBack();
  };

  return (
    <>
      <div className="my-3">
        <Button
          onClick={() => {
            setShowDelete(true);
          }}
          size="small"
          color="error"
          className="w-full"
        >
          <span className="whitespace-nowrap">Delete</span>
        </Button>
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
