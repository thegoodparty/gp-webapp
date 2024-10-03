import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';
import PublicCandidates from './components/PublicCandidates';

const meta = pageMetaData({
  title: 'Public Candidates | GoodParty.org',
  description: 'Public Candidates',
  slug: '/admin/public-candidates',
});
export const metadata = meta;

export default async function Page() {
  await adminAccessOnly();

  return <PublicCandidates />;
}
