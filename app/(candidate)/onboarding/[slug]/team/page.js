export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import OnboardingTeamPage from './components/OnboardingTeamPage';

const meta = pageMetaData({
  title: 'Build a Campaign Team | GOOD PARTY',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
});

export const metadata = meta;

export default async function Page({ params }) {
  const { slug } = params;
  const campaign = await getCampaign(params);

  const childProps = {
    campaign,
  };
  return <OnboardingTeamPage {...childProps} />;
}
