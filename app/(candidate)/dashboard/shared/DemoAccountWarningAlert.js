import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { DemoAccountDeleteDialog } from '@shared/utils/DemoAccountDeleteDialog';
import { handleDemoAccountDeletion } from '@shared/utils/handleDemoAccountDeletion';

export const DemoAccountWarningAlert = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDemoAlertButtonOnClick = () => {
    setShowModal(true);
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
      <DemoAccountDeleteDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        handleProceed={handleDemoAccountDeletion(snackbarState, router)}
      />
    </>
  );
};
