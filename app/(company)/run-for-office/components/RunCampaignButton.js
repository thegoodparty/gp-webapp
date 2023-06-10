'use client';
import Pill from '@shared/buttons/Pill';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getUserCookie, setCookie } from 'helpers/cookieHelper';
import { useRouter } from 'next/navigation';
import WarningButton from '@shared/buttons/WarningButton';

export async function fetchUserCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    return await gpFetch(api, false, 1);
  } catch (e) {
    console.log('error1', JSON.stringify(e));
    return false;
  }
}

export async function createCampaign() {
  try {
    const api = gpApi.campaign.onboarding.create;
    const { slug } = await gpFetch(api);
    if (slug) {
      deleteCookie('afterAction');
      deleteCookie('returnUrl');
      window.location.href = `/onboarding/${slug}/dashboard`;
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
  const router = useRouter();
  const handleRun = async () => {
    const user = getUserCookie(true);
    if (!user) {
      setCookie('afterAction', 'createCampaign');
      router.push('/register');
    } else {
      const { campaign } = await fetchUserCampaign();
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
        <div className="text-black tracking-wide">{label}</div>
      </WarningButton>
    </div>
  );
}
