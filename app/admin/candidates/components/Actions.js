import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ImpersonateAction from '/app/admin/shared/ImpersonateAction';

async function handleCancelRequest(slug) {
  try {
    const api = gpApi.campaign.onboarding.cancelLaunchRequest;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function Actions({ launched, slug, email }) {
  const [showMenu, setShowMenu] = useState(false);
  const isLive = launched === 'Live';
  const snackbarState = useHookstate(globalSnackbarState);

  const cancelRequest = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Cancelling request',
        isError: false,
      };
    });

    await handleCancelRequest(slug);
    await revalidatePage('/admin/candidates');
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'cancelled',
        isError: false,
      };
    });
    window.location.reload();
  };

  return (
    <div className="flex justify-center relative">
      <BsThreeDotsVertical
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className=" text-xl cursor-pointer"
      />
      {showMenu && (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={() => {
              setShowMenu(false);
            }}
          />

          <div className="absolute bg-white px-4 py-3 rounded-xl shadow-lg z-10 left-24 top-3">
            <ImpersonateAction
              email={email}
              isCandidate={true}
              slug={slug}
              launched={launched}
            />
            {launched == 'Pending Review' && (
              <div className="my-3" onClick={cancelRequest}>
                <PrimaryButton size="small" fullWidth>
                  <span className="whitespace-nowrap">
                    Cancel Review Request
                  </span>
                </PrimaryButton>
              </div>
            )}

            <DeleteAction slug={slug} isLive={isLive} />
          </div>
        </>
      )}
    </div>
  );
}
