'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
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
  const user = getUserCookie(true);
  const [claimed, setClaimed] = useState(route.volunteer === user.id);

  const handleClaim = async () => {
    await claimRoute(route.id);
    setClaimed(true);
  };

  const handleUnclaim = async () => {
    await unclaimRoute(route.id);
    setClaimed(false);
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
    </div>
  );
}
