'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
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

async function renameContent(key, name) {
  const subSectionKey = 'aiContent';
  try {
    const api = gpApi.campaign.onboarding.ai.rename;
    const payload = {
      subSectionKey,
      key,
      name,
    };
    const resp = await gpFetch(api, payload);
    if (resp?.status === 'success') {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function RenameAction({
  documentKey,
  showRename,
  setShowRename,
  setDocumentName,
  tableVersion,
}) {
  // const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState('');
  const snackbarState = useHookstate(globalSnackbarState);

  const handleRename = async (key, name) => {
    const renameResp = await renameContent(key, name);
    if (renameResp === true) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Renamed document',
          isError: false,
        };
      });
      if (tableVersion === true) {
        window.location.href = '/dashboard/content';
      } else {
        setDocumentName(newName);
      }
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error renaming document',
          isError: true,
        };
      });
    }
    setShowRename(false);
    // if(tableVersion === true) // then reload the table, else reload the page
    // will the table reload ?
    // window.location.reload();
  };

  return (
    <>
      <Modal closeCallback={() => setShowRename(false)} open={showRename}>
        <div className="lg:min-w-[740px]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Rename document
          </H2>
          <H6 className="mt-14 mb-2">Document name</H6>
          <TextField
            native={'true'}
            required
            variant="outlined"
            placeholder="Enter document name"
            fullWidth
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
          <div className="mt-16 flex w-full justify-end">
            <div
              onClick={() => {
                setShowRename(false);
              }}
            >
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
            <div
              className="ml-3"
              onClick={() => {
                handleRename(documentKey, newName);
              }}
            >
              <PrimaryButton>Save</PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
