import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminUsersPage from './components/AdminUsersPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin Users',
  description: 'Admin Users Dashboard.',
  slug: '/admin/users',
});
export const metadata = meta;

const fetchUsers = async () => {
  const api = gpApi.admin.users;
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const { users } = await fetchUsers();

  const childProps = {
    pathname: '/admin/users',
    title: 'Users',
    users,
  };
  return <AdminUsersPage {...childProps} />;
}
