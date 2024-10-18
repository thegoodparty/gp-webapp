'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import { TextField } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import H2 from '@shared/typography/H2';
import H6 from '@shared/typography/H6';
import { useSnackbar } from 'helpers/useSnackbar';

async function renameContent(key, name) {
  try {
    const api = gpApi.campaign.ai.rename;
    const payload = {
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
  documentName = '',
}) {
  // const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState('');
  const { successSnackbar, errorSnackbar } = useSnackbar();

  const handleRename = async (key, name) => {
    const renameResp = await renameContent(key, name);
    if (renameResp === true) {
      successSnackbar('Renamed document');
      if (tableVersion === true) {
        window.location.href = '/dashboard/content';
      } else {
        setDocumentName(newName);
      }
    } else {
      errorSnackbar('Error renaming document');
    }
    setShowRename(false);
  };

  return (
    <>
      <Modal closeCallback={() => setShowRename(false)} open={showRename}>
        <div className="min-w-[80vw] lg:min-w-[740px]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Rename document
          </H2>
          <H6 className="mt-14 mb-2">Document name</H6>
          <TextField
            native={'true'}
            required
            variant="outlined"
            placeholder="Enter document name"
            maxLength={50}
            defaultValue={documentName ? documentName : ''}
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
              <PrimaryButton
                disabled={newName.length === 0 || newName.length >= 50}
              >
                Save
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
