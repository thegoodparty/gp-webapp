'use client';
import Pill from '@shared/buttons/Pill';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getUserCookie, setCookie } from 'helpers/cookieHelper';
import { useRouter } from 'next/navigation';
import WarningButton from '@shared/buttons/WarningButton';
import { fetchUserCampaignClient } from 'helpers/campaignHelper';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

export async function createCampaign() {
  try {
    const api = gpApi.campaign.onboarding.create;
    const { slug } = await gpFetch(api);
    if (slug) {
      deleteCookie('afterAction');
      deleteCookie('returnUrl');
      window.location.href = `/onboarding/${slug}/1`;
    }
  } catch (e) {
    console.log('error2', JSON.stringify(e));
    return false;
  }
}

export default function RunCampaignButton({
  fullWidth,
  id = '',
  label = 'Get Started',
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleRun = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const user = getUserCookie(true);
    if (!user) {
      setCookie('afterAction', 'createCampaign');
      router.push('/register');
    } else {
      const { campaign } = await fetchUserCampaignClient();
      if (campaign?.slug) {
        router.push(`/onboarding/${campaign.slug}/dashboard`);
      } else {
        await createCampaign(router);
      }
    }
  };
  return (
    <div className="relative z-10" onClick={handleRun} id={id}>
      <WarningButton className={`${fullWidth ? 'w-full' : 'w-full lg:w-48'}`}>
        {loading ? (
          <div className="px-10">
            <CircularProgress size={18} />
          </div>
        ) : (
          <div className="text-black tracking-wide">{label}</div>
        )}
      </WarningButton>
    </div>
  );
}
