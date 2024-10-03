import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';
import AddCampaignPage from './components/AddCampaignPage';

const meta = pageMetaData({
  title: 'Add Campaign| GOOD PARTY',
  description: 'Admin Add a new Campaign',
  slug: '/admin/add-campaign',
});
export const metadata = meta;

export default async function Page({ searchParams }) {
  await adminAccessOnly();

  const childProps = {
    pathname: '/admin/add-campaign',
    title: 'Add a new Campaign',
  };

  return <AddCampaignPage {...childProps} />;
}
