import { adminAccessOnly } from 'helpers/permissionHelper';
import AddCandidatePage from './components/AddCandidatePage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin Candidates | GoodParty.org',
  description: 'Admin Candidates Dashboard.',
  slug: '/admin/candidates',
});
export const metadata = meta;

export default async function Page() {
  adminAccessOnly();

  const childProps = {
    pathname: '/admin/add-candidate',
    title: 'Add a candidate',
  };
  return <AddCandidatePage {...childProps} />;
}
