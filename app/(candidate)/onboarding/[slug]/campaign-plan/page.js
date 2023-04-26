export const dynamic = 'force-dynamic';

import CampaignPlanPage from './components/CampaignPlanPage';
import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import campaignPlanFields from './campaignPlanFields';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';

const meta = pageMetaData({
  title: 'Campaign Manager | GOOD PARTY',
  description: 'Campaign Manager',
  slug: '/onboarding',
});
export const metadata = meta;

export default async function Page({ params }) {
  const campaign = await getCampaign(params);
  const sections = campaignPlanFields;
  const { content } = await fetchContentByKey('blogArticles');
  const articlesBySlug = mapArticlesBySlug(content);

  const childProps = {
    campaign,
    sections,
    articlesBySlug,
  };

  return <CampaignPlanPage {...childProps} />;
}

function mapArticlesBySlug(content) {
  let bySlug = {};
  content.forEach((article) => {
    bySlug[article.slug] = article;
  });
  return bySlug;
}
