import OptimizeScript from '@shared/scripts/OptimizeScript';
import GetDemoPage from './components/GetDemoPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Book a Demo',
  description:
    "Book a brief 1:1 meeting with our team to learn about Good Party's free tools for independent and third-party candidates. We'll cover your campaign needs, our tool's functionality. and show you the tool in action.",

  slug: '/info-session',
  image: 'https://assets.goodparty.org/academy-intro.jpg',
});
export const metadata = meta;

export default async function Page(params) {
  return <GetDemoPage />;
}
