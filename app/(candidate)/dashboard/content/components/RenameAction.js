'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { FaPencilAlt } from 'react-icons/fa';
import { Button } from '@mui/material';
import Modal from '@shared/utils/Modal';
import { TextField } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import H2 from '@shared/typography/H2';
import H6 from '@shared/typography/H6';


async function renameContent(key) {
  try {
    const api = gpApi.campaign.onboarding.adminRename;
    const payload = {
      key,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function RenameAction({ key }) {
  const [showRename, setShowRename] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleRename = async () => {

      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Deleting...',
          isError: false,
        };
      });

    //   snackbarState.set(() => {
    //     return {
    //       isOpen: true,
    //       message: 'Renamed',
    //       isError: false,
    //     };
    //   });
    // await renameContent(key);
    // await revalidateContent();
    // await revalidatePage('/admin/candidates');
    // window.location.reload();
  };

  return (
    <>
    <Button onClick={() => setShowRename(true)}>
        <span
        className="text-gray-800 hover:text-slate-50 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3"
        >
        <div
            className="whitespace-nowrap text-lg flex items-center w-full"
        >
            <FaPencilAlt className="text-[14px]" />
            <div className="ml-3 font-sfpro text-[17px]">Rename</div>
        </div>
        </span>
    </Button>

    <Modal closeCallback={() => setShowRename(false)} open={showRename}>

    <div className="lg:min-w-[740px]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Rename document
          </H2>
          <H6 className="mt-14 mb-2">Document name</H6>
          <TextField
            native
            required
            variant="outlined"
            placeholder="Enter document name"
            fullWidth
          />
          <div className="mt-16 flex w-full justify-end">
            <div
              onClick={() => {
                setShowRename(false);
              }}
            >
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
            <div className="ml-3" onClick={handleRename}>
              <PrimaryButton>Save</PrimaryButton>
            </div>
          </div>
        </div>
    </Modal>    
    </>
  );
}
