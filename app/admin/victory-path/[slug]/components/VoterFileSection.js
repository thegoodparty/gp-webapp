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

async function purchaseVoterFile(slug) {
  try {
    const api = gpApi.voterData.purchaseVoterFile;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
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

  const handlePurchase = async () => {
    if (processing) return;
    setProcessing(true);
    const response = await purchaseVoterFile(campaign.slug);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Voter file purchased',
          isError: false,
        };
      });
      await revalidatePage('/admin/victory-path/[slug]');
      // window.location.reload();
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error purchasing voter file',
          isError: true,
        };
      });
      setProcessing(false);
    }
  };

  let status = 'noElectionType';
  if (
    campaign.pathToVictory?.electionType &&
    campaign.pathToVictory?.electionLocation
  ) {
    status = 'hasElectionType';
  }
  if (campaign.hasVoterFile === 'processing') {
    status = 'processingVoterFile';
  }
  if (campaign.hasVoterFile === 'completed') {
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

  console.log('campaign', campaign);
  return (
    <div className="bg-slate-50 rounded border border-slate-300 p-4 my-12">
      <H3>Voter File (pro account)</H3>
      {status === 'noElectionType' && (
        <div>
          {campaign.p2vStatus === 'Waiting' ? (
            <div className="my-4">Path To Victory is processing...</div>
          ) : (
            <div className="my-4">
              This campaign does not have a L2 election column. (Older path to
              victory didn&apos;t save that column)
            </div>
          )}
          <div className="my-4" onClick={handleRerun}>
            <SuccessButton disabled={processing}>
              Rerun Path to Victory
            </SuccessButton>
          </div>
        </div>
      )}
      {status === 'hasElectionType' && (
        <div>
          <div className="flex items-center mt-4">
            <div onClick={handlePurchase}>
              <SuccessButton disabled={processing}>
                Purchase Voter File
              </SuccessButton>
            </div>
          </div>
          <Body1 className="mt-4">
            Note: this might take a few minutes to complete.
          </Body1>
        </div>
      )}
      {status === 'processing' && (
        <div>
          The voter file is being purchased. This might take a few minutes.
          Please refresh the page to update the status
        </div>
      )}
      {status === 'hasVoterFile' && (
        <div>This campaign already has a voter file.</div>
      )}
    </div>
  );
}
