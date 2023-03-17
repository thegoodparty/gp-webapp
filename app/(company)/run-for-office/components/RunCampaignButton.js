'use client';
import PurpleButton from '@shared/buttons/PurpleButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getUserCookie, setCookie } from 'helpers/cookieHelper';
import { useRouter } from 'next/navigation';

export async function fetchUserCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    return await gpFetch(api, false, 1);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function createCampaign(router) {
  try {
    const api = gpApi.campaign.onboarding.create;
    const { slug } = await gpFetch(api);
    if (slug) {
      router.push(`/onboarding/${slug}/dashboard`);
      deleteCookie('afterAction');
      deleteCookie('returnUrl');
    }
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function RunCampaignButton() {
  const router = useRouter();
  const handleRun = async () => {
    const user = getUserCookie(true);
    if (!user) {
      setCookie('returnUrl', '/onboarding');
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
    <div onClick={handleRun}>
      <PurpleButton
        style={{
          borderRadius: '40px',
          width: '100%',
          padding: '20px auto',
        }}
      >
        <div className="whitespace-nowrap font-bold text-xl tracking-wide">
          GET STARTED
        </div>
      </PurpleButton>
    </div>
  );
}
