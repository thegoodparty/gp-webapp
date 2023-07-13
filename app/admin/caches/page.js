import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminCachePage from './components/AdminCachePage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin Bust Cache',
  description: 'Admin Users can Bust Caches.',
  slug: '/admin/caches',
});
export const metadata = meta;

export default async function Page() {
  adminAccessOnly();

  const childProps = {
    pathname: '/admin/caches',
    title: 'Admin Bust Cache',
  };
  return <AdminCachePage {...childProps} />;
}
