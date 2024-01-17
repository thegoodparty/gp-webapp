export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import { redirect } from 'next/navigation';
import OnboardingPage from './components/OnboardingPage';

const meta = pageMetaData({
  title: 'Candidate Onboarding | GOOD PARTY',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
});
export const metadata = meta;

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params);

  const totalSteps = 6;

  let stepInt = step ? parseInt(step, 10) : 1;
  if (Number.isNaN(stepInt) || stepInt < 1 || stepInt > totalSteps) {
    redirect(`/onboarding/${slug}/1`);
  }

  const childProps = {
    step: stepInt,
    campaign,
    totalSteps,
  };
  return <OnboardingPage {...childProps} />;
}
