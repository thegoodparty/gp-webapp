import pageMetaData from 'helpers/metadataHelper';
import ElectionsPage from './components/ElectionsPage';

const meta = pageMetaData({
  title: 'Election Research',
  description:
    ': Learn about elected offices to run for in your community and how to get on the ballot! A free resource for real people to find new ways to serve their community.',

  slug: '/elections',
  image: 'https://assets.goodparty.org/elections.png',
});
export const metadata = meta;

export default async function Page(params) {
  return <ElectionsPage />;
}
