import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';

export default function Actions({
  id,
  showMenu,
  setShowMenu,
  deleteHistoryCallBack,
}) {
  return (
    <div className="flex justify-center relative">
      <BsThreeDotsVertical
        onClick={() => {
          setShowMenu(id);
        }}
        className=" text-xl cursor-pointer"
      />
      {showMenu && showMenu === id ? (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={() => {
              setShowMenu(0);
            }}
          />
          <div className="absolute bg-white px-4 py-3 rounded-xl shadow-lg z-10 right-24 top-3">
            <DeleteAction
              id={id}
              setShowMenu={setShowMenu}
              deleteHistoryCallBack={deleteHistoryCallBack}
            />
          </div>
        </>
      ) : (
        <> </>
      )}
    </div>
  );
}
