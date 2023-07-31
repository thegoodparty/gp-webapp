import OptimizeScript from '@shared/scripts/OptimizeScript';
import VolunteerPage from './components/VolunteerPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Volunteer with Good Party',
  description:
    'Want to find a way to help build a more vibrant democracy? Learn about how our volunteer program works, opportunities to get involved, and how your actions can have a huge impact. Get in touch with us to start your volunteer journey with Good Party.',
  slug: '/volunteer',
  image: 'https://assets.goodparty.org/volunteer.jpg',
});
export const metadata = meta;

export default async function Page(params) {
  return (
    <>
      <OptimizeScript />
      <VolunteerPage />
    </>
  );
}
