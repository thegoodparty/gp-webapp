import pageMetaData from 'helpers/metadataHelper';
import GetStickersPage from './components/GetStickersPage';

export const revalidate = 3600;
export const dynamic = 'force-static';

const meta = pageMetaData({
  title: 'Get your FREE stickers',
  description:
    "It's time to show that the MAJORITY of us are INDEPENDENTS. Get your FREE GoodParty.org Stickers to #BrightenAmerica",

  slug: '/get-stickers',
  image: 'https://assets.goodparty.org/landing/stickers3.png',
});
export const metadata = meta;

export default async function Page(params) {
  return <GetStickersPage />;
}
