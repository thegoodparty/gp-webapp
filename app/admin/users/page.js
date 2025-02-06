import { adminAccessOnly } from 'helpers/permissionHelper';
import AdminUsersPage from './components/AdminUsersPage';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

const meta = pageMetaData({
  title: 'Admin Users',
  description: 'Admin Users Dashboard.',
  slug: '/admin/users',
});
export const metadata = meta;
export const maxDuration = 60;

const fetchUsers = async () => {
  const resp = await serverFetch(apiRoutes.admin.user.list);
  return resp.data;
};

const buildDefaultTableFilters = (searchParams) =>
  Object.keys(searchParams).reduce(
    (accumulator, key) => [
      ...accumulator,
      ...(searchParams[key]
        ? [
            {
              id: key,
              value: searchParams[key],
            },
          ]
        : []),
    ],
    [],
  );

export default async function Page({ searchParams }) {
  await adminAccessOnly();
  const users = await fetchUsers();

  const childProps = {
    pathname: '/admin/users',
    title: 'Users',
    users,
    defaultFilters: buildDefaultTableFilters(searchParams),
  };

  return <AdminUsersPage {...childProps} />;
}
