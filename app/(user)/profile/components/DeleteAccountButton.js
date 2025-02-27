'use client';
/**
 *
 * DeleteSection
 *
 */
import React, { useState } from 'react';
import AlertDialog from '@shared/utils/AlertDialog';
import { deleteCookies } from 'helpers/cookieHelper';
import ErrorButton from '@shared/buttons/ErrorButton';
import { FaTrash } from 'react-icons/fa';
import { handleLogOut } from '@shared/user/handleLogOut';
import { useSnackbar } from 'helpers/useSnackbar';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

async function deleteAccountCallback(id) {
  try {
    const resp = await clientFetch(apiRoutes.user.deleteAccount, { id });

    if (resp.ok) {
      await handleLogOut();
      deleteCookies();
      window.location.href = '/';
    } else {
      console.error('Error deleting account', resp.statusText);
      return 'Error deleting account';
    }
  } catch (error) {
    console.error('Error deleting account', resp.statusText);
    return 'Error deleting account';
  }
}

function DeleteAccountButton({ userId }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { errorSnackbar } = useSnackbar();

  async function handleDeleteAccount() {
    trackEvent(EVENTS.Settings.DeleteAccount.SubmitDelete);
    const msg = await deleteAccountCallback(userId);
    if (msg) {
      errorSnackbar(msg);
    }
  }

  return (
    <div>
      <div
        onClick={() => {
          trackEvent(EVENTS.Settings.DeleteAccount.ClickDelete);
          setShowConfirmDelete(true);
        }}
      >
        <ErrorButton variant="outlined">
          <div className="flex items-center">
            <FaTrash />
            <div className="ml-2">Delete Account</div>
          </div>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showConfirmDelete}
        handleClose={() => {
          trackEvent(EVENTS.Settings.DeleteAccount.CancelDelete);
          setShowConfirmDelete(false);
        }}
        title="Delete Account"
        ariaLabel="Delete Account"
        description="Are you sure you want to delete your account? This cannot be undone."
        handleProceed={handleDeleteAccount}
      />
    </div>
  );
}

export default DeleteAccountButton;
