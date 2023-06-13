'use client';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import CandidatePage from './CandidatePage';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

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

export function debounce(func, args, timeout = 600) {
  clearTimeout(window.timer);
  window.timer = setTimeout(() => {
    func(args);
  }, timeout);
}

export default function EditCandidatePage(props) {
  const { candidate, campaign } = props;
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
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    await updateCandidate(candidate);
    await revalidateCandidates();
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saved',
        isError: false,
      };
    });
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
