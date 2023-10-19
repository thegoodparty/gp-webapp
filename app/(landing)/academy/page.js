import OptimizeScript from '@shared/scripts/OptimizeScript';
import AcademyPage from './components/AcademyPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Good Party Academy',
  description:
    "Explore the possibility of serving your community and running for office in our free, 3-session course, Good Party Academy. We'll cover everything from evaluating a possible campaign, launching your candidacy, and running an efficient and effective operation. Taught by experts Rob Booth and Jared Alper, the Academy is open to all who want to make their community a better place and run a people-centered campaign.",
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
