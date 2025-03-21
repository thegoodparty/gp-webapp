'use client';
import ErrorButton from '@shared/buttons/ErrorButton';
import AlertDialog from '@shared/utils/AlertDialog';
import { revalidatePage } from 'helpers/cacheHelper';
import { useState } from 'react';
import { useSnackbar } from 'helpers/useSnackbar';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

async function deleteUser(id) {
  try {
    return await clientFetch(apiRoutes.admin.user.delete, { id });
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export default function DeleteAction({ id }) {
  const [showDelete, setShowDelete] = useState(false);
  const { successSnackbar, errorSnackbar } = useSnackbar();

  const handleDelete = async () => {
    successSnackbar('Deleting...');
    await deleteUser(id);
    await revalidatePage('/admin/users');
    successSnackbar('Deleted');
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
          <span className="whitespace-nowrap">Delete User</span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        handleProceed={handleDelete}
      />
    </>
  );
}
