export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { fetchUserCampaignServer } from '../why/page';
import MoreInfoPage from './components/MoreInfoPage';

export default async function Page({ params }) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }

  const childProps = {
    self: `/onboarding/${slug}/goals/why`,
    title: 'Goals & Objectives - More Info',
    description: ' ',
    slug,
    campaign,
  };
  return <MoreInfoPage {...childProps} />;
}
