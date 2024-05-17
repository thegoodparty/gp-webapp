import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AiContentPage from './components/AiContentPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'AI Content | GoodParty.org',
  description: 'AI Content.',
  slug: '/admin/ai-content',
});
export const metadata = meta;

export const fetchCampaigns = async () => {
  const api = gpApi.campaign.onboarding.list;
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const { campaigns } = await fetchCampaigns();

  const childProps = {
    pathname: '/admin/ai-content',
    title: 'AI Content',
    campaigns,
  };
  return <AiContentPage {...childProps} />;
}
