import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';
import ImpersonateAction from '/app/admin/shared/ImpersonateAction';

export default function Actions({ launched, slug, email }) {
  const [showMenu, setShowMenu] = useState(false);
  const isLive = launched === 'Live';

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

            <DeleteAction slug={slug} isLive={isLive} />
          </div>
        </>
      )}
    </div>
  );
}
