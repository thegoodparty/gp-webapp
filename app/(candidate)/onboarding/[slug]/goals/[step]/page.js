export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import campaignSteps from '../../dashboard/[[...section]]/campaignSteps';
import goalsFields from './goalsFields';

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params);

  let stepInt = step ? parseInt(step, 10) : 1;

  const stepFields = goalsFields[stepInt - 1];
  const { pageType } = stepFields;
  const subSectionLabel = campaignSteps[0].steps[1].title;
  const subSectionKey = campaignSteps[0].steps[1].key;

  let nextPath = `/${subSectionKey}/${stepInt + 1}`;
  if (pageType === 'messagingStrategy') {
    nextPath = '/dashboard';
  }
  const section = { label: 'Pre Launch', index: 1 };

  const childProps = {
    title: stepFields.title,
    subTitle: stepFields.subTitle,
    slug,
    campaign,
    inputFields: stepFields.fields,
    step: stepInt,
    pathname: `/${subSectionKey}/${stepInt}`,
    pageType,
    nextPath,
    subSectionKey,
    section,
    subSectionLabel,
  };
  return <OnboardingStepPage {...childProps} />;
}
