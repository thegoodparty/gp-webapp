import OptimizeScript from '@shared/scripts/OptimizeScript';
import AcademyIntroPage from './components/AcademyIntroPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'GoodParty.org Academy Intro Meeting',
  description:
    "Book a meeting with our team to discuss GoodParty.org Academy and secure your spot. We'll discuss the curriculum, your background, and how the course prepares you to make a clear-headed decision about running for office.",
  slug: '/academy-intro',
  image: 'https://assets.goodparty.org/academy-intro.jpg',
});
export const metadata = meta;

export default async function Page(params) {
  return <AcademyIntroPage />;
}
