import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

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

export default function Actions({ campaignOnboardingSlug }) {
  const [showMenu, setShowMenu] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

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
            {campaignOnboardingSlug}
          </div>
        </>
      )}
    </div>
  );
}
