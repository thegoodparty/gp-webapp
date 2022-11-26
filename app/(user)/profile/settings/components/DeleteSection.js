'use client';
/**
 *
 * DeleteSection
 *
 */

import React, { useState } from 'react';
import PortalPanel from '@shared/candidate-portal/PortalPanel';
import AlertDialog from '@shared/utils/AlertDialog';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { deleteCookies } from 'helpers/cookieHelper';

async function deleteAccountCallback() {
  try {
    const api = tgpApi.user.deleteAccount;
    await gpFetch(api, null, 3600);
    deleteCookies();
    window.location.href = '/';
  } catch (error) {
    console.log('Error deleting account', error);
    // yield put(
    //   snackbarActions.showSnakbarAction('Error deleting account', 'error'),
    // );
  }
}
function DeleteSection() {
  // const { deleteAccountCallback } = useContext(ProfileSettingsPageContext);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  return (
    <section>
      <PortalPanel color="red">
        <h3
          className="text-[22px] tracking-wide font-black mb-16"
          data-cy="delete-account-title"
        >
          Danger Zone - Delete your account
        </h3>
        <BlackButtonClient
          onClick={() => setShowConfirmDelete(true)}
          style={{
            background: 'red',
            color: '#fff',
            borderColor: 'red',
          }}
        >
          <div className="py-0 px-6  font-black">Delete Account</div>
        </BlackButtonClient>
      </PortalPanel>
      <AlertDialog
        open={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        title="Delete Account"
        ariaLabel="Delete Account"
        description="Are you sure you want to delete your account? This cannot be undone."
        handleProceed={deleteAccountCallback}
      />
    </section>
  );
}

export default DeleteSection;
