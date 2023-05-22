import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import pageMetaData from 'helpers/metadataHelper';
import CampaignPlanPage from './components/CampaignPlanPage';

const meta = pageMetaData({
  title: 'Campaign Plan | GOOD PARTY',
  description: 'Campaign Plan',
  slug: '/dashboard/plan',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const childProps = {
    pathname: '/dashboard/plan',
  };
  return <CampaignPlanPage {...childProps} />;
}
