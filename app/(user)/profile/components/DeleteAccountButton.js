'use client';
/**
 *
 * DeleteSection
 *
 */
import React, { useState } from 'react';
import AlertDialog from '@shared/utils/AlertDialog';
import { deleteCookies } from 'helpers/cookieHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ErrorButton from '@shared/buttons/ErrorButton';
import { FaTrash } from 'react-icons/fa';
import { handleLogOut } from '@shared/user/handleLogOut';

async function deleteAccountCallback() {
  try {
    const api = gpApi.user.deleteAccount;
    await gpFetch(api);
    await handleLogOut();
    deleteCookies();
    window.location.href = '/';
  } catch (error) {
    console.log('Error deleting account', error);
  }
}

function DeleteAccountButton() {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  return (
    <div>
      <div onClick={() => setShowConfirmDelete(true)}>
        <ErrorButton variant="outlined">
          <div className="flex items-center">
            <FaTrash />
            <div className="ml-2">Delete Account</div>
          </div>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        title="Delete Account"
        ariaLabel="Delete Account"
        description="Are you sure you want to delete your account? This cannot be undone."
        handleProceed={deleteAccountCallback}
      />
    </div>
  );
}

export default DeleteAccountButton;
