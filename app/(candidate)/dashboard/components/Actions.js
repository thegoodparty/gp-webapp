import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';

export default function Actions({
  id,
  showMenu,
  setShowMenu,
  deleteHistoryCallBack,
  actionName,
}) {
  return (
    <div className="relative">
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
              setShowMenu(false);
            }}
          />
          <div className="absolute bg-white px-4 py-3 rounded-xl shadow-lg z-10 left-4 top-2">
            <DeleteAction
              id={id}
              description={
                <>
                  Are you sure you want to delete <strong>{actionName}?</strong>
                  <br />
                  Deleted campaign history cannot be recovered.{' '}
                </>
              }
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
