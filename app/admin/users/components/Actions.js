import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { handleImpersonateUser } from 'app/admin/shared/impersonateUser';

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

export default function Actions({ id, email }) {
  const [showMenu, setShowMenu] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const impersonateUser = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Impersonating user',
        isError: false,
      };
    });

    const impersonateResp = await handleImpersonateUser(email);
    console.log('impersonateResp', impersonateResp);
    if (impersonateResp) {
      window.location.href = '/';
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
            <div className="my-3" onClick={impersonateUser}>
              <PrimaryButton size="small" fullWidth>
                <span className="whitespace-nowrap">Impersonate</span>
              </PrimaryButton>
            </div>

            <DeleteAction id={id} />
          </div>
        </>
      )}
    </div>
  );
}
