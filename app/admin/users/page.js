import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminUsersPage from './components/AdminUsersPage';

export const fetchUsers = async () => {
  const api = gpApi.admin.users;
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const { users } = await fetchUsers();

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Users',
    users,
  };
  return <AdminUsersPage {...childProps} />;
}
