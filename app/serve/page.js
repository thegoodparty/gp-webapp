import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';

import ServePage from './components/ServePage';

const meta = pageMetaData({
  title: 'Serve| GOOD PARTY',
  description: 'Serve',
  slug: '/serve',
});

export const metadata = meta;

export default async function Page({ searchParams }) {
  await adminAccessOnly();
  const childProps = {
    pathname: '/serve',
    title: 'Serve dashboard',
  };

  return <ServePage {...childProps} />;
}
