'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import PortalPanel from '@shared/layouts/PortalPanel';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import gpApi from 'gpApi';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpFetch from 'gpApi/gpFetch';

const enhanceCandidates = async () => {
  try {
    const api = gpApi.admin.enhanceCandidates;
    await gpFetch(api);
    return true;
  } catch (e) {
    console.log('error at enhanceCandidates', e);
    return false;
  }
};

export default function MiscActionsPage(props) {
  const [processing, setProcessing] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleEnhance = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Waiting for subscription',
        isError: false,
      };
    });
    return;
    if (processing) return;
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Processing. This might take a few minutes.',
        isError: false,
      };
    });
    setProcessing(true);
    const res = await enhanceCandidates();
    if (res) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Completed',
          isError: false,
        };
      });
      setProcessing(false);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message:
            'Error (or timeout. Do not try again. wait for it to update the sheet).',
          isError: true,
        };
      });
    }
  };
  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <H1>Misc Actions</H1>
        <div className="mt-12">
          <div className="mb-6 pb-6 border-b border-gray-600">
            <Body1 className="mb-6">
              Enhance{' '}
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer nofollow"
                href="https://docs.google.com/spreadsheets/d/1RtSsYx4bbVvsNFw9aZxi2GDplcVCTft95bClcuPQPaE/edit#gid=893341878"
              >
                candidates contact info
              </a>
              <br />
              <br />
              <strong>Note:</strong> This might take a few minutes. Do not
              retry. Instead look for the slack message in #bot-dev channel.
            </Body1>
            <div onClick={handleEnhance}>
              <PrimaryButton disabled={processing}>
                Enhance Candidates
              </PrimaryButton>
            </div>
          </div>
        </div>
      </PortalPanel>
    </AdminWrapper>
  );
}
