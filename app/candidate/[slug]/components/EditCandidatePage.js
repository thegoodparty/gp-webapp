'use client';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import CandidatePage from './CandidatePage';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { revalidateCandidates } from 'helpers/cacheHelper';
// import { debounce } from '/helpers/debounceHelper';

export async function updateCandidate(candidate) {
  try {
    const api = gpApi.candidate.update;
    const payload = {
      candidate,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function EditCandidatePage(props) {
  const { candidate, campaign, isStaged } = props;
  const snackbarState = useHookstate(globalSnackbarState);

  const [color, setColor] = useState(candidate.color || '#734BDC');
  useEffect(() => {
    updateCampaign({
      ...campaign,
      profile: {
        completed: true,
      },
    });
  }, []);

  const updateColorCallback = (color) => {
    setColor(color);
    // const updatedCampaign = {
    //   ...campaign,
    //   color,
    // };
    // debounce(updateCampaign, updatedCampaign);
  };

  const saveCallback = async (candidate) => {
    let res;
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    if (isStaged && campaign) {
      res = await updateCampaign(candidate);
    } else {
      res = await updateCandidate(candidate);
      if (res) {
        await revalidateCandidates();
      }
    }
    if (res) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Saved',
          isError: false,
        };
      });
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error Saving',
          isError: true,
        };
      });
    }
  };

  const childProps = {
    ...props,
    editMode: true,
    color,
    updateColorCallback,
    saveCallback,
  };

  return <CandidatePage {...childProps} />;
}
