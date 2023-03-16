import { redirect } from 'next/navigation';
import { fetchUserCampaign } from '../page';

export default async function getCampaign(params) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaign();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  return campaign;
}
