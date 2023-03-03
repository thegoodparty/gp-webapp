export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import teamFields from './teamFields';

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params);

  let stepInt = step ? parseInt(step, 10) : 1;

  const stepFields = teamFields[stepInt - 1];

  const campaignKey = 'team';

  let nextPath = `/${campaignKey}/${stepInt + 1}`;
  if (stepFields.finalStep) {
    nextPath = `/dashboard`;
  }

  const childProps = {
    title: stepFields.title,
    subTitle: stepFields.subTitle,
    slug,
    campaign,
    inputFields: stepFields.fields,
    step: stepInt,
    pathname: `/${campaignKey}/${stepInt}`,
    nextPath,
    campaignKey,
  };
  return <OnboardingStepPage {...childProps} />;
}
