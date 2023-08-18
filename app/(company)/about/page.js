import pageMetaData from 'helpers/metadataHelper';
import AboutPage from './components/AboutPage';

const meta = pageMetaData({
  title: 'About Good Party | GOOD PARTY',
  description:
    "Good Party is not a political party. We're building tools to change the rules and a movement of people to disrupt the corrupt!",
  slug: '/about',
});

export const metadata = meta;

export default async function Page(params) {
  return <AboutPage />;
}
