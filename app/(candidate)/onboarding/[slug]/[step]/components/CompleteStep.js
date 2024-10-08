'use client';
import { useHookstate } from '@hookstate/core';
import PartyAnimation from '@shared/animations/PartyAnimation';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
import { buildTrackingAttrs, trackEvent } from 'helpers/fullStoryHelper';
import { useState } from 'react';

async function launchCampaign() {
  try {
    const api = gpApi.campaign.launch;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at launchCampaign', e);
    return false;
  }
}

export default function CompleteStep() {
  const [loading, setLoading] = useState(false);
  const user = getUserCookie(true);
  const snackbarState = useHookstate(globalSnackbarState);
  const trackingAttrs = buildTrackingAttrs('Onboarding Complete Button');

  const handleSave = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });

    const attr = [{ key: 'data.currentStep', value: 'onboarding-complete' }];

    await updateCampaign(attr);
    const res = await launchCampaign();
    if (res) {
      trackEvent('onboarding_complete', { type: 'candidate' });
      window.location.href = '/dashboard/plan';
    } else {
      setLoading(false);
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error launching your campaign',
          isError: true,
        };
      });
    }
  };

  return (
    <div className="text-center">
      <div className="max-w-xs m-auto mb-4">
        <PartyAnimation loop={true} />
      </div>
      <H1>Congrats, {user.firstName}!</H1>
      <Body1 className="mt-4 mb-8">
        You&apos;re officially part of the GoodParty.org community. Let&apos;s
        get started!
      </Body1>
      <PrimaryButton onClick={handleSave} fullWidth {...trackingAttrs}>
        {loading ? 'Launching...' : 'View Dashboard'}
      </PrimaryButton>
    </div>
  );
}
