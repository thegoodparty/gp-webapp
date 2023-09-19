import pageMetaData from 'helpers/metadataHelper';
import AdsPage from './components/AdsPage';

const meta = pageMetaData({
  title: 'Good Party ADS 2023',
  description:
    'Join the community at Good Party to volunteer, connect on Discord, or run for office with our support.',
  slug: '/ads2023',
});

export const metadata = meta;

export default async function Page(params) {
  return <AdsPage />;
}
