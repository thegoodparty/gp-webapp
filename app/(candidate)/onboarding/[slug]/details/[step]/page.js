export const dynamic = 'force-dynamic';

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchArticle } from 'app/blog/article/[slug]/page';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchContentByKey } from 'helpers/fetchHelper';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import OnboardingStepPage from '../../../shared/OnboardingStepPage';
import campaignSteps from '../../dashboard/campaignSteps';
import detailsFields from './detailsFields';
import pageMetaData from 'helpers/metadataHelper';

export const fetchPositions = async () => {
  const api = gpApi.admin.position.list;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export const fetchRaces = async (zip) => {
  const api = gpApi.ballotData.races;
  const payload = { zip };
  const token = getServerToken(payload);
  return await gpFetch(api, payload, 3600, token);
};

async function loadCandidatePosition(slug) {
  try {
    const api = gpApi.campaign.candidatePosition.find;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at loadCandidatePosition', e);
    return false;
  }
}

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

  const stepFields = detailsFields[stepInt - 1];
  const { pageType } = stepFields;
  let positions = [];
  if (pageType === 'issuesPage') {
    ({ positions } = await fetchPositions());
  }
  if (stepInt === 1) {
    const user = getServerUser();
    const name = user.name.split(' ');
    stepFields.fields[0].initialValue = name[0];
    stepFields.fields[1].initialValue =
      name.length > 0 ? name[name.length - 1] : '';
  }

  if (stepInt === 2) {
    const user = getServerUser();
    stepFields.fields[0].initialValue = user.phone;
  }

  if (stepInt === 3) {
    const user = getServerUser();
    stepFields.fields[0].initialValue = user.zip;
  }
  let candidatePositions;

  if (stepInt === 12) {
    ({ candidatePositions } = await loadCandidatePosition(slug));
  }

  // let races;
  // if (stepInt === 7) {
  //   ({ races } = await fetchRaces(campaign?.details?.zip));
  // }

  let pledge;
  if (pageType === 'pledgePage') {
    const res = await fetchContentByKey('pledge');
    pledge = res.content;
  }
  const subSectionKey = campaignSteps[0].key;
  const subSectionLabel = campaignSteps[0].plainTitle;

  const childProps = {
    title: stepFields.title,
    subTitle: stepFields.subTitle,
    skipable: stepFields.skipable,
    slug,
    campaign,
    inputFields: stepFields.fields,
    step: stepInt,
    pathname: `/${subSectionKey}/${stepInt}`,
    pageType,
    pledge,
    positions,
    nextPath: `/${subSectionKey}/${stepInt + 1}`,
    subSectionKey,
    totalSteps: detailsFields.length,
    subSectionLabel,
    candidatePositions,
    // races,
  };
  return <OnboardingStepPage {...childProps} />;
}
