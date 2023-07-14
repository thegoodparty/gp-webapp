'use client';
import ErrorButton from '@shared/buttons/ErrorButton';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';

import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

async function deleteCampaign(slug) {
  try {
    const api = gpApi.campaign.onboarding.adminDelete;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function deactivateCandidate(slug) {
  try {
    const api = gpApi.admin.deactivateCandidate;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function DeleteAction({ slug, isLive }) {
  const [showDelete, setShowDelete] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDelete = async () => {
    if (isLive) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'hiding candidate',
          isError: false,
        };
      });
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Hidden',
          isError: false,
        };
      });
      setShowDelete(false);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Deleting...',
          isError: false,
        };
      });

      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Deleted',
          isError: false,
        };
      });
    }
    await deleteCampaign(slug);
    await revalidateCandidates();
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
          <span className="whitespace-nowrap">
            {isLive ? 'Hide Candidate' : 'Delete Campaign'}
          </span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        title={isLive ? 'Hide Candidate' : 'Delete Campaign'}
        description={`Are you sure you want to ${
          isLive
            ? 'hide this candidate?'
            : 'delete this campaign? This cannot be undone.'
        }`}
        handleProceed={handleDelete}
      />
    </>
  );
}
