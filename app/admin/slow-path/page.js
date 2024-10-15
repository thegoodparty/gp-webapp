import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin TEST PAGE',
  description: 'Admin TEST PAGE.',
});
export const metadata = meta;
export const maxDuration = 25;

export default async function Page({ searchParams }) {
  await adminAccessOnly();

  const timeout = searchParams?.t ? Number(searchParams?.t) : 31000;

  await new Promise((resolve) => setTimeout(resolve, timeout));

  return <div>Real slow eh</div>;
}
