export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import strategyFields from './strategyFields';

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params);

  let stepInt = step ? parseInt(step, 10) : 1;

  const stepFields = strategyFields[stepInt - 1];
  const { pageType } = stepFields;
  const campaignKey = 'strategy';

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
