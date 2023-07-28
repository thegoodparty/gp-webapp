import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import DeleteAction from './DeleteAction';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';

async function reactivate(id) {
  try {
    const api = gpApi.admin.reactivateCandidate;
    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function Actions({ id, campaignOnboardingSlug, isActive }) {
  const [showMenu, setShowMenu] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const reactivateCandidate = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'reactivating candidate',
        isError: false,
      };
    });
    await reactivate(id);
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Reactivated',
        isError: false,
      };
    });

    await revalidateCandidates();
    await revalidatePage('/admin/all-candidates');
    await revalidatePage('/admin/candidates');
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
            {campaignOnboardingSlug && !isActive && (
              <div className="my-3" onClick={reactivateCandidate}>
                <PrimaryButton size="small">Reactivate</PrimaryButton>
              </div>
            )}
            <DeleteAction id={id} />
          </div>
        </>
      )}
    </div>
  );
}
