'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import PortalPanel from '@shared/layouts/PortalPanel';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

async function deleteCampaign() {
  try {
    const api = gpApi.campaign.onboarding.delete;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function AdminDelete() {
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    await deleteCampaign();
    router.push('/onboarding');
  };

  const user = getUserCookie(true);
  if (!user.isAdmin) {
    return null;
  }
  return (
    <PortalPanel color="#ff00ff">
      <BlackButtonClient
        onClick={() => {
          setShowDelete(true);
        }}
      >
        Delete this campaign
      </BlackButtonClient>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
        }}
        title="Delete Campaign"
        ariaLabel="Delete Campaign"
        description="Are you sure you want to delete this campaign? This cannot be undone."
        handleProceed={handleDelete}
      />
    </PortalPanel>
  );
}
