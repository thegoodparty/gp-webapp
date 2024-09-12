import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AiContentPage from './components/AiContentPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'AI Content | GoodParty.org',
  description: 'AI Content.',
  slug: '/admin/ai-content',
});
export const metadata = meta;

export default async function Page() {
  adminAccessOnly();

  const childProps = {
    pathname: '/admin/ai-content',
    title: 'AI Content',
  };
  return <AiContentPage {...childProps} />;
}
