export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import { shortVersionStep4 } from '../../dashboard/campaignSteps';
import profileFields from './profileFields';
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

  const stepFields = profileFields[stepInt - 1];
  const { pageType } = stepFields;

  const subSectionKey = shortVersionStep4.key;
  const subSectionLabel = shortVersionStep4.plainTitle;

  console.log('subsectionKeu', subSectionKey);

  const nextPath = '/dashboard';

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
    totalSteps: profileFields.length,
  };
  return <OnboardingStepPage {...childProps} />;
}
