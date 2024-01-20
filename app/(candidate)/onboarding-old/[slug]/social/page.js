export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding-old/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import OnboardingSocialPage from './components/OnboardingSocialPage';

const meta = pageMetaData({
  title: 'Online presence & social media | GOOD PARTY',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
});

export const metadata = meta;

export default async function Page({ params }) {
  const campaign = await getCampaign(params);

  const childProps = {
    campaign,
  };
  return <OnboardingSocialPage {...childProps} />;
}
