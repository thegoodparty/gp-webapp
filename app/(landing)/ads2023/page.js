import pageMetaData from 'helpers/metadataHelper';
import AdsPage from './components/AdsPage';

const meta = pageMetaData({
  title: 'GoodParty.org ADS 2023',
  description:
    'Join the community at GoodParty.org to volunteer, connect on Discord, or run for office with our support.',
  slug: '/ads2023',
});

export const metadata = meta;

export default async function Page(params) {
  return <AdsPage />;
}
