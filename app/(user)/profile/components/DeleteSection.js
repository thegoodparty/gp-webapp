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
import H3 from '@shared/typography/H3';
import { RiDeleteBin7Line } from 'react-icons/ri';
import Body2 from '@shared/typography/Body2';
import ErrorButton from '@shared/buttons/ErrorButton';

async function deleteAccountCallback() {
  try {
    const api = gpApi.user.deleteAccount;
    await gpFetch(api);
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
    <section className="py-4 flex">
      <div className="shrink-0 pr-3 text-indigo-50 pt-[6px]">
        <RiDeleteBin7Line />
      </div>
      <div className="flex-1">
        <H3>Danger Zone - Delete your account</H3>
        <Body2 className="text-indigo-600 mb-6">
          Remove all your information from our site
        </Body2>
        <div onClick={() => setShowConfirmDelete(true)}>
          <ErrorButton>Delete Account</ErrorButton>
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
    </section>
  );
}

export default DeleteSection;
