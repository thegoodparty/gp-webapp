import InfoSessionPage from './components/InfoSessionPage';
import pageMetaData from 'helpers/metadataHelper';

export const revalidate = 3600;
export const dynamic = 'force-static';

const meta = pageMetaData({
  title: 'Book an info session',
  description:
    "Book a brief 1:1 meeting with our team to learn about getting involved with GoodParty.org and our theory of change. We'll uncover how your unique skills, background, and passion can help advance the movement to elect more independent candidates!",
  slug: '/info-session',
  image: 'https://assets.goodparty.org/info-session.png',
});
export const metadata = meta;

export default async function Page(params) {
  return <InfoSessionPage />;
}
