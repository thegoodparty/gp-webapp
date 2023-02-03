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

export async function fetchContentByKey(key) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key,
  };
  return await gpFetch(api, payload, 3600);
}

export default async function Page({ params }) {
  const { slug } = params;

  const { campaign } = await fetchUserCampaignServer();
  const { content } = await fetchContentByKey('pledge');
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }

  const childProps = {
    self: `/onboarding/${slug}/pledge`,
    title: 'Take the pledge',
    description:
      'You must accept the Good Party Pledge to be a candidate on our site.',
    slug,
    campaign,
    content,
  };
  return <PledgePage {...childProps} />;
}
