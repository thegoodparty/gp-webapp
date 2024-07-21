import pageMetaData from 'helpers/metadataHelper';
import GetStickersPage from './components/GetStickersPage';

const meta = pageMetaData({
  title: 'Get your FREE stickers for free',
  description:
    "It's time to show that the Not a political party. We're building free tools to change the rules, so good independent candidates can run and win!",

  slug: '/get-stickers',
  image: 'https://assets.goodparty.org/landing/stickers3.png',
});
export const metadata = meta;

export default async function Page(params) {
  return <GetStickersPage />;
}
