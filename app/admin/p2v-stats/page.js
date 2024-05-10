import { adminAccessOnly } from 'helpers/permissionHelper';
import P2VStatsPage from './components/P2VStatsPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'P2V Stats | GOOD PARTY',
  description: 'P2V Stats',
  slug: '/admin/p2v-stats',
});
export const metadata = meta;

export default async function Page() {
  adminAccessOnly();

  const childProps = {};
  return <P2VStatsPage {...childProps} />;
}
