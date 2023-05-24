'use client';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useRouter } from 'next/navigation';

async function launchCampaign(slug) {
  try {
    const api = gpApi.campaign.onboarding.launch;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at launchCampaign', e);
    return {};
  }
}

export default function ReviewBanner({ campaign }) {
  const router = useRouter();

  const { launchStatus } = campaign;
  const launch = async () => {
    const { slug } = await launchCampaign(campaign.slug);
    if (slug) {
      router.push(`/candidate/${slug}`);
    }
  };
  return (
    <div className="pt-4">
      <div className="bg-black text-white p-3 text-center rounded font-bold">
        Admin Review mode
        {launchStatus === 'pending' && (
          <div onClick={launch} className="mt-4">
            <SecondaryButton size="medium">Approve</SecondaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
