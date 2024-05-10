'use client';

import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';

async function claimRoute(id) {
  try {
    const api = gpApi.campaign.campaignVolunteer.routes.claim;

    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at acceptInvitation', e);
    return {};
  }
}

async function unclaimRoute(id) {
  try {
    const api = gpApi.campaign.campaignVolunteer.routes.unclaim;

    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at acceptInvitation', e);
    return {};
  }
}

export default function ClaimButton(props) {
  const { route } = props;
  const claimed = route.claimedByUser;
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    await claimRoute(route.id);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleUnclaim = async () => {
    await unclaimRoute(route.id);
    window.location.reload();
  };

  return (
    <div className="mt-4 mb-2">
      {claimed ? (
        <PrimaryButton fullWidth onClick={handleUnclaim}>
          Leave Route
        </PrimaryButton>
      ) : (
        <PrimaryButton variant="outlined" fullWidth onClick={handleClaim}>
          Claim Route
        </PrimaryButton>
      )}
      {loading ? (
        <div className="fixed top-0 left-0 w-screen h-screen z-[1201] flex items-center justify-center bg-black bg-opacity-25">
          <div className="w-64 h-64">
            <CheckmarkAnimation />
          </div>
        </div>
      ) : null}
    </div>
  );
}
