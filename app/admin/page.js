import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import AdminPage from './components/AdminPage';

export default async function Page() {
  adminAccessOnly();

  const childProps = {
    pathname: '/admin',
    title: 'Admin Dashboard',
  };
  return <AdminPage {...childProps} />;
}
