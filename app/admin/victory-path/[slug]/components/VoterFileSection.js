'use client';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidatePage } from 'helpers/cacheHelper';
import H3 from '@shared/typography/H3';
import SuccessButton from '@shared/buttons/SuccessButton';
import Body1 from '@shared/typography/Body1';
import { useState } from 'react';
import PurchaseVoterFile from './PurchaseVoterFile';
import RerunP2V from './RerunP2V';

async function rerunP2V(slug) {
  try {
    const api = gpApi.voterData.pathToVictory;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function VoterFileSection(props) {
  const { campaign } = props;
  const [processing, setProcessing] = useState(false);

  const snackbarState = useHookstate(globalSnackbarState);

  let status = 'noElectionType';
  if (
    campaign.pathToVictory?.electionType &&
    campaign.pathToVictory?.electionLocation
  ) {
    status = 'hasElectionType';
  }
  if (campaign.data?.hasVoterFile === 'processing') {
    status = 'processingVoterFile';
  }
  if (campaign.data?.hasVoterFile === 'completed') {
    status = 'hasVoterFile';
  }

  const handleRerun = async () => {
    if (processing) return;
    setProcessing(true);
    const response = await rerunP2V(campaign.slug);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Path to victory rerun',
          isError: false,
        };
      });
      await revalidatePage('/admin/victory-path/[slug]');
      window.location.reload();
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error rerunning path to victory',
          isError: true,
        };
      });
      setProcessing(false);
    }
  };

  return (
    <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
      <H3>Voter File (pro account)</H3>
      {status === 'noElectionType' && (
        <div>
          {campaign.pathToVictory?.p2vStatus === 'Waiting' ? (
            <div className="my-4">Path To Victory is processing...</div>
          ) : (
            <div className="my-4">
              This campaign does not have a L2 election column. (Older path to
              victory didn&apos;t save that column)
            </div>
          )}
          <RerunP2V campaign={campaign} />
        </div>
      )}
      {status === 'hasElectionType' && campaign.isPro && (
        <div>
          <PurchaseVoterFile campaign={campaign} />
          <Body1 className="mt-4">
            Note: this might take a few minutes to complete.
          </Body1>
        </div>
      )}
      {status === 'processingVoterFile' && (
        <div>
          The voter file is being purchased. This might take a few minutes.
          Please refresh the page to update the status
          <PurchaseVoterFile campaign={campaign} />
        </div>
      )}
      {status === 'hasVoterFile' && (
        <div>This campaign already has a voter file.</div>
      )}
    </div>
  );
}
