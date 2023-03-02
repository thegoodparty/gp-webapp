export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchContentByKey } from 'helpers/fetchHelper';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import DetailsStepPage from './components/DetailsStepPage';
import goalsFields from './goalsFields';

export default async function Page({ params }) {
  const { slug, step } = params;

  let stepInt = step ? parseInt(step, 10) : 1;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }

  const stepFields = goalsFields[stepInt - 1];
  const { pageType } = stepFields;
  let positions = [];
  if (pageType === 'issuesPage') {
    ({ positions } = await fetchPositions());
  }

  let pledge;
  if (pageType === 'pledgePage') {
    const res = await fetchContentByKey('pledge');
    pledge = res.content;
  }

  const childProps = {
    title: stepFields.title,
    subTitle: stepFields.subTitle,
    slug,
    campaign,
    fields: stepFields.fields,
    step: stepInt,
    pathname: `/details/${stepInt}`,
    pageType,
    pledge,
    positions,
  };
  return <DetailsStepPage {...childProps} />;
}
