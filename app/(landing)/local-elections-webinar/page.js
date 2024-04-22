import pageMetaData from 'helpers/metadataHelper';
import { LocalElectionsWebinarPage } from './components/LocalElectionsWebinarPage';

const meta = pageMetaData({
  title: 'Good Party | Local Elections Academy Webinar',
  description:
    'Join us on May 7th to learn how you can plan, run, and win a local campaign in 2024. Hear from leading experts and Good Party and Forward Party and kick off your journey to making a difference in your community.',
  slug: '/local-elections-webinar',
});

export const metadata = meta;

const Page = () => <LocalElectionsWebinarPage />

export default Page
