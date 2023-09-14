import OptimizeScript from '@shared/scripts/OptimizeScript';
import AcademyPage from './components/AcademyPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Good Party Academy | GOOD PARTY',
  description:
    'Learn how to run for office in our new master class for FREE.  We’ll teach you how to run a winning indie or 3rd party campaign from launch through election day.',
  slug: '/academy',
  image: 'https://assets.goodparty.org/academy.jpg',
});
export const metadata = meta;

export default async function Page(params) {
  return (
    <>
      <AcademyPage />
    </>
  );
}
