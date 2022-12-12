import { adminAccessOnly } from 'helpers/permissionHelper';
import AddCandidatePage from './components/AddCandidatePage';

export default async function Page() {
  adminAccessOnly();

  const childProps = {
    pathname: '/admin/add-candidate',
    title: 'Add a candidate',
  };
  return <AddCandidatePage {...childProps} />;
}
