export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import PledgePage from './components/PledgePage';

const fetchUserCampaignServer = async () => {
  const api = gpApi.campaign.onboarding.findByUser;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export default async function Page({ params }) {
  console.log('pledge page1');
  const { slug } = params;
  console.log('pledge page2', slug);

  const { campaign } = await fetchUserCampaignServer();
  console.log('pledge page3', campaign);
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }

  console.log('pledge page4');

  const childProps = {
    self: `/onboarding/${slug}/pledge`,
    title: 'Take the pledge',
    description:
      'You must accept the Good Party Pledge to be a candidate on our site.',
    slug,
    campaign,
  };
  return <PledgePage {...childProps} />;
}
