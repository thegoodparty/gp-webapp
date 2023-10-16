import pageMetaData from 'helpers/metadataHelper';
import WebinarPage from './components/WebinarPage';

const meta = pageMetaData({
  title: 'Good Party Academy Webinar',
  description:
    'Explore the possibility of serving your community and running for office in our free 90-minute webinar, Good Party Academy. We’ll cover everything from evaluating a possible campaign to launching your candidacy to running an efficient and effective operation. Taught by experts Rob Booth and Jared Alper, the Academy is open to all who want to make their community a better place and run a people-centered campaign.',
  slug: '/academy-webinar',
});

export const metadata = meta;

export default async function Page(params) {
  return <WebinarPage />;
}
