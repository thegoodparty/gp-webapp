import OptimizeScript from '@shared/scripts/OptimizeScript';
import AcademyIntroPage from './components/AcademyIntroPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Good Party Academy Intro Meeting',
  description:
    "Book a meeting with our team to discuss Good Party Academy and secure your spot. We'll discuss the curriculum, your background, and how the course prepares you to make a clear-headed decision about running for office.",
  slug: '/academy-intro',
});
export const metadata = meta;

export default async function Page(params) {
  return <AcademyIntroPage />;
}
