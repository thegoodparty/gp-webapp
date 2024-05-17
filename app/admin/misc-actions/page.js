import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import MiscActionsPage from './components/MiscActionsPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Misc Actions | GoodParty.org',
  description: 'Misc Actions',
  slug: '/admin/misc-actions',
});
export const metadata = meta;

export default async function Page() {
  adminAccessOnly();

  const childProps = {};
  return <MiscActionsPage {...childProps} />;
}
