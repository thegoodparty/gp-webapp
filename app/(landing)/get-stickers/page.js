import pageMetaData from 'helpers/metadataHelper';
import GetStickersPage from './components/GetStickersPage';

const meta = pageMetaData({
  title: 'Get your FREE stickers for free',
  description:
    "It's time to show that the MAJORITY of us are INDEPENDENTS. Get your FREE GoodParty.org Stickers to #BrightenAmerica",

  slug: '/get-stickers',
  image: 'https://assets.goodparty.org/landing/stickers3.png',
});
export const metadata = meta;

export default async function Page(params) {
  return <GetStickersPage />;
}
