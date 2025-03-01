import VolunteerPage from './components/VolunteerPage';
import pageMetaData from 'helpers/metadataHelper';

export const revalidate = 3600;
export const dynamic = 'force-static';

const meta = pageMetaData({
  title: 'Get Involved',
  description:
    'Learn about volunteer opportunities to help independent candidates and build connections. GoodParty.org needs your help in the mission to make people matter more than money in our democracy.',
  slug: '/volunteer',
  image: 'https://assets.goodparty.org/volunteer.png',
});
export const metadata = meta;

export default async function Page(params) {
  return <VolunteerPage />;
}
