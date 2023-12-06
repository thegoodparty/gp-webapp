import OptimizeScript from '@shared/scripts/OptimizeScript';
import InfoSessionPage from './components/InfoSessionPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Book an info session',
  description:
    'Book a brief 1:1 meeting with our team to learn about getting involved with Good Party and our theory of change. We’ll uncover how your unique skills, background, and passion can help advance the movement to elect more independent candidates!',
  slug: '/info-session',
  image: 'https://assets.goodparty.org/academy-intro.jpg',
});
export const metadata = meta;

export default async function Page(params) {
  return <InfoSessionPage />;
}
