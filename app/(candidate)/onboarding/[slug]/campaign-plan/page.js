export const dynamic = 'force-dynamic';

import CampaignPlan from './components/CampaignPlan';
import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import campaignPlanFields from './campaignPlanFields';
import { fetchContentByKey } from 'helpers/fetchHelper';

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

  return <CampaignPlan {...childProps} />;
}

function mapArticlesBySlug(content) {
  let bySlug = {};
  console.log('count contnet', content.length);
  content.forEach((article) => {
    console.log('slu', article.slug);
    bySlug[article.slug] = article;
  });
  console.log('count', Object.keys(bySlug).length);
  return bySlug;
}
