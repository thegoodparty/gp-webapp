import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import AdminPage from './components/AdminPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pagemetaData({
  title: 'Admin Dashboard',
  description: 'Admin Dashboard.',
});
export const metadata = meta;

export default async function Page() {
  adminAccessOnly();

  const childProps = {
    pathname: '/admin',
    title: 'Admin Dashboard',
  };
  return <AdminPage {...childProps} />;
}
