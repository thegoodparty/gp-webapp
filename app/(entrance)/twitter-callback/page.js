import TwitterCallbackPage from './components/twitterCallbackPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Twitter Login | GOOD PARTY',
  description: 'Login to Good Party.',
  slug: '/twitter-callback',
});
export const metadata = meta;

export default async function Page() {
  return <TwitterCallbackPage />;
}
