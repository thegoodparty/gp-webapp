export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import goalsFields from './goalsFields';

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params);

  let stepInt = step ? parseInt(step, 10) : 1;

  const stepFields = goalsFields[stepInt - 1];
  const { pageType } = stepFields;
  const campaignKey = 'goals';

  let nextPath = `/${campaignKey}/${stepInt + 1}`;
  if (pageType === 'messagingStrategy') {
    nextPath = '/dashboard';
  }

  const childProps = {
    title: stepFields.title,
    subTitle: stepFields.subTitle,
    slug,
    campaign,
    inputFields: stepFields.fields,
    step: stepInt,
    pathname: `/${campaignKey}/${stepInt}`,
    pageType,
    nextPath,
    campaignKey,
  };
  return <OnboardingStepPage {...childProps} />;
}
