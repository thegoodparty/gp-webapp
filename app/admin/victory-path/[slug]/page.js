import { adminAccessOnly } from 'helpers/permissionHelper';
import AdminVictoryPathPage from './components/AdminVictoryPathPage';
import pageMetaData from 'helpers/metadataHelper';
import { fetchCampaignBySlugServerOnly } from 'helpers/fetchCampaignBySlugServerOnly';
import { CampaignProvider } from '@shared/hooks/CampaignProvider';

const meta = pageMetaData({
  title: 'Admin Path to Victory | GoodParty.org',
  description: 'Admin Path to Victory.',
  slug: '/admin/victory-path',
});
export const metadata = meta;

export default async function Page({ params }) {
  adminAccessOnly();
  const { slug } = params;
  const { campaign } = await fetchCampaignBySlugServerOnly(slug);

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Path to Victory',
    campaign,
  };
  return (
    <CampaignProvider campaign={campaign}>
      <AdminVictoryPathPage {...childProps} />
    </CampaignProvider>
  );
}
