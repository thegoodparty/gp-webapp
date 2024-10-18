'use client';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useSnackbar } from 'helpers/useSnackbar';

async function deleteContent(key) {
  try {
    const api = gpApi.campaign.ai.delete;
    const payload = {
      key,
    };
    await gpFetch(api, payload);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function DeleteAction({
  documentKey,
  showDelete,
  setShowDelete,
}) {
  const { successSnackbar, errorSnackbar } = useSnackbar();

  const handleDelete = async (documentKey) => {
    const deleteResp = await deleteContent(documentKey);
    if (deleteResp) {
      successSnackbar('Deleted');
      window.location.href = '/dashboard/content';
    } else {
      errorSnackbar('Failed to delete.');
    }
  };

  return (
    <>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        title={'Delete Content'}
        description={`Are you sure you want to delete this content? This cannot be undone.`}
        handleProceed={() => {
          handleDelete(documentKey);
        }}
      />
    </>
  );
}
