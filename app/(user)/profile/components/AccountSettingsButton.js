import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { PaymentPortalButton } from '@shared/PaymentPortalButton';
import { MdOpenInNew } from 'react-icons/md';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { DemoAccountDeleteDialog } from '@shared/utils/DemoAccountDeleteDialog';
import { handleDemoAccountDeletion } from '@shared/utils/handleDemoAccountDeletion';
import Link from 'next/link';

export const AccountSettingsButton = ({ isPro, isDemo }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  return isPro ? (
    <PaymentPortalButton>
      Manage Subscription
      <MdOpenInNew className="ml-2" />
    </PaymentPortalButton>
  ) : isDemo ? (
    <>
      <PrimaryButton onClick={() => setShowModal(true)}>
        Change Plan
      </PrimaryButton>
      <DemoAccountDeleteDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        handleProceed={handleDemoAccountDeletion(snackbarState, router)}
      />
    </>
  ) : (
    <div>
      <Link className="underline" href="/dashboard/pro-sign-up">
        <PrimaryButton>Upgrade Plan</PrimaryButton>
      </Link>
    </div>
  );
};
