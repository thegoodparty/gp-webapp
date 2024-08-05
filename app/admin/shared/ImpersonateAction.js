'use client';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser';

export default function ImpersonateAction({
  email,
  isCandidate,
  launched: launchStatus,
}) {
  const snackbarState = useHookstate(globalSnackbarState);
  const { impersonate } = useImpersonateUser();

  const handleImpersonateUser = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Impersonating user',
        isError: false,
      };
    });

    const impersonateResp = await impersonate(email);
    if (impersonateResp) {
      if (isCandidate && launchStatus === 'Live') {
        window.location.href = `/dashboard`;
      } else {
        window.location.href = '/';
      }
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Impersonate failed',
          isError: true,
        };
      });
    }
  };

  return (
    <div className="my-3">
      <PrimaryButton onClick={handleImpersonateUser} size="small" fullWidth>
        <span className="whitespace-nowrap">Impersonate</span>
      </PrimaryButton>
    </div>
  );
}
