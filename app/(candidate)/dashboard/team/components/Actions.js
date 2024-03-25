'use client';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AlertDialog from '@shared/utils/AlertDialog';

async function deleteInvitation(id) {
  try {
    const api = gpApi.campaign.volunteerInvitation.delete;

    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at sendInvitation', e);
    return {};
  }
}

export default function Actions({ invitation, reloadInvitationsCallback }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const handleDelete = async () => {
    await deleteInvitation(invitation.id);
    reloadInvitationsCallback();
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

          <div className="absolute bg-white py-3 rounded-xl shadow-lg z-10 right-6 top-1">
            <div
              className="p-4 whitespace-nowrap  cursor-pointer"
              onClick={() => {
                setShowDeleteWarning(true);
              }}
            >
              Delete Invitation
            </div>
          </div>
        </>
      )}
      <AlertDialog
        open={showDeleteWarning}
        handleClose={() => {
          setShowDeleteWarning(false);
        }}
        title={`Are you sure you want to delete this invitation?`}
        description="The invitation email was already sent."
        handleProceed={handleDelete}
      />
    </div>
  );
}
