import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import AlertDialog from '@shared/utils/AlertDialog';

export const PENDING_REQUEST_ACTIONS = {
  APPROVE: 'APPROVE',
  DELETE: 'DELETE',
};

export const PendingRequestActions = ({ onSelect = (action) => {} }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

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

          <div className="absolute bg-white py-3 rounded-xl shadow-lg z-10 right-6 top-1">
            <div
              className="p-4 whitespace-nowrap  cursor-pointer"
              onClick={() => {
                setShowDeleteWarning(true);
                setShowMenu(false);
              }}
            >
              Delete
            </div>
          </div>
        </>
      )}
      <AlertDialog
        open={showDeleteWarning}
        handleClose={() => {
          setShowDeleteWarning(false);
        }}
        title={`Are you sure?`}
        description="This cannot be undone."
        handleProceed={() => onSelect(PENDING_REQUEST_ACTIONS.DELETE)}
      />
    </div>
  );
};
