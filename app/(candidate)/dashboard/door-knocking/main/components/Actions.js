'use client';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AlertDialog from '@shared/utils/AlertDialog';
import ManageCampaign from './ManageCampaign';

async function deleteDkCampaign(slug) {
  try {
    const api = gpApi.doorKnocking.delete;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function archiveDkCampaign(slug) {
  try {
    const api = gpApi.doorKnocking.archive;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function Actions({
  campaign,
  campaignDates,
  updateCampaignsCallback,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showArchiveWarning, setShowArchiveWarning] = useState(false);
  const handleDelete = async () => {
    await deleteDkCampaign(campaign.slug);
    window.location.reload();
  };

  const handleArchive = async () => {
    await archiveDkCampaign(campaign.slug);
    updateCampaignsCallback();
    setShowArchiveWarning();
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

          <div className="absolute bg-white py-3 rounded-xl shadow-lg z-10 right-6 top-1">
            {campaign.status !== 'archived' && (
              <>
                <ManageCampaign
                  campaign={campaign}
                  campaignDates={campaignDates}
                  updateCampaignsCallback={updateCampaignsCallback}
                />

                <div
                  className="p-4 whitespace-nowrap  border-b border-slate-300"
                  onClick={() => {
                    setShowArchiveWarning(true);
                  }}
                >
                  Archive Campaign
                </div>
              </>
            )}
            <div
              className="p-4 whitespace-nowrap"
              onClick={() => {
                setShowDeleteWarning(true);
              }}
            >
              Delete Campaign
            </div>
          </div>
        </>
      )}
      <AlertDialog
        open={showDeleteWarning}
        handleClose={() => {
          setShowDeleteWarning(false);
        }}
        title={`Are you sure you want to delete ${campaign.name}`}
        description="Deleting your campaign will permanently erase all associated data. Once deleted, campaigns cannot be recovered or retrieved."
        handleProceed={handleDelete}
      />
      <AlertDialog
        open={showArchiveWarning}
        handleClose={() => {
          setShowArchiveWarning(false);
        }}
        title={`Are you sure you want to archive ${campaign.name}`}
        description="Archiving this campaign will store all associated data for future reference, while discontinuing further usage. Once archived, campaigns cannot be reactivated."
        handleProceed={handleArchive}
      />
    </div>
  );
}
