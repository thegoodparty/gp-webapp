import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import AlertDialog from '@shared/utils/AlertDialog';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const deleteDemoCampaign = async () => {
  await gpFetch(gpApi.campaign.deleteDemoCampaign);
};

export const DemoAccountWarningAlert = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDemoAlertButtonOnClick = () => {
    setShowModal(true);
  };

  const handleProceed = async () => {
    try {
      await deleteDemoCampaign();
    } catch (e) {
      console.error(e);
      snackbarState.set(() => ({
        isOpen: true,
        message: 'Error clearing demo campaign',
        isError: true,
      }));
      return;
    }
    router.push('/account-type');
  };

  return (
    <>
      <AlertBanner
        title="Demo Account Notice"
        message="Updates made in your demo account are not stored. Upgrade now to prevent data loss."
        actionOnClick={handleDemoAlertButtonOnClick}
        actionText="Upgrade"
        severity="warning"
      />
      <AlertDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        title="Are you sure?"
        ariaLabel="Upgrade Account"
        description="Are you sure you want to upgrade your account? All demo campaign data will be lost."
        handleProceed={handleProceed}
      />
    </>
  );
};
