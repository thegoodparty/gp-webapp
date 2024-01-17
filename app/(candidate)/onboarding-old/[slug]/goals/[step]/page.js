export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import campaignSteps from '../../dashboard/campaignSteps';
import goalsFields from './goalsFields';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Candidate Onboarding | GOOD PARTY',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
});

export const metadata = meta;

export default async function Page({ params }) {
  const { slug, step } = params;
  const campaign = await getCampaign(params);

  let stepInt = step ? parseInt(step, 10) : 1;

  const stepFields = goalsFields[stepInt - 1];
  const { pageType } = stepFields;
  const subSectionKey = campaignSteps[1].key;
  const subSectionLabel = campaignSteps[1].plainTitle;

  let nextPath = `/${subSectionKey}/${stepInt + 1}`;
  if (stepInt === goalsFields.length) {
    const campaign = await getCampaign(params);
    nextPath = '/dashboard';
  }

  const childProps = {
    title: stepFields.title,
    subTitle: stepFields.subTitle,
    skipable: stepFields.skipable,
    skipLabel: stepFields.skipLabel,
    slug,
    campaign,
    inputFields: stepFields.fields,
    step: stepInt,
    pathname: `/${subSectionKey}/${stepInt}`,
    pageType,
    nextPath,
    subSectionKey,
    subSectionLabel,
    totalSteps: goalsFields.length,
  };
  return <OnboardingStepPage {...childProps} />;
}
