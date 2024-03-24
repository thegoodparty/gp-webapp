import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Volunteer Dashboard | GOOD PARTY',
  description: 'Volunteer Dashboard',
  slug: '/volunteer-dashboard',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const childProps = {};
  return <div>volunteer dashboard</div>;
}
