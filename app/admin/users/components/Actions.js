import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';
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

export default function Actions({ id, email }) {
  const [showMenu, setShowMenu] = useState(false);

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
            <ImpersonateAction email={email} isCandidate={false} />

            <DeleteAction id={id} />
          </div>
        </>
      )}
    </div>
  );
}
