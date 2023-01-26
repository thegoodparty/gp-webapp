import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import PledgePage from './components/PledgePage';

const fetchUserCampaignsServer = async () => {
  const api = gpApi.campaign.onboarding.findByUser;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export default async function Page({ params }) {
  const { slug } = params;

  const { campaigns } = await fetchUserCampaignsServer();
  if (!campaigns || !campaigns.length > 0 || campaigns[0].slug !== slug) {
    redirect('/onboarding');
  }

  const childProps = {
    self: `/onboarding/${slug}`,
    title: 'Take the pledge',
    description:
      'You must accept the Good Party Pledge to be a candidate on our site.',
    slug,
  };
  return <PledgePage {...childProps} />;
}
