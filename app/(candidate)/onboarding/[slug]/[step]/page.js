export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import { redirect } from 'next/navigation';
import OnboardingPage from './components/OnboardingPage';
import { fetchContentByKey } from 'helpers/fetchHelper';

const meta = pageMetaData({
  title: 'Candidate Onboarding | GOOD PARTY',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
});
export const metadata = meta;

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params, true);

  const totalSteps = 6;

  let stepInt = step ? parseInt(step, 10) : 1;
  if (Number.isNaN(stepInt) || stepInt < 1 || stepInt > totalSteps) {
    redirect(`/onboarding/${slug}/1`);
  }

  let pledge;
  if (stepInt === 6) {
    const res = await fetchContentByKey('pledge');
    pledge = res.content;
  }

  const childProps = {
    step: stepInt,
    campaign,
    totalSteps,
    pledge,
  };
  return <OnboardingPage {...childProps} />;
}
