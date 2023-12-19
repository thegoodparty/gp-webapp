import pageMetaData from 'helpers/metadataHelper';
import HowToRunPage from './components/HowToRunPage';

const meta = pageMetaData({
  title: 'How to run',
  description: 'How to run',

  slug: '/how-to-run',
});
export const metadata = meta;

export default async function Page(params) {
  return <HowToRunPage />;
}
