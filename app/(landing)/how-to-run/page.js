import pageMetaData from 'helpers/metadataHelper';
import HowToRunPage from './components/HowToRunPage';

const meta = pageMetaData({
  title: 'Election Research',
  description:
    ': Learn about elected offices to run for in your community and how to get on the ballot! A free resource for real people to find new ways to serve their community.',

  slug: '/how-to-run',
});
export const metadata = meta;

export default async function Page(params) {
  return <HowToRunPage />;
}
