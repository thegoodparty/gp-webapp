import pageMetaData from 'helpers/metadataHelper';
import RunForOfficePage from './components/RunForOfficePage';

const meta = pageMetaData({
  title:
    "Run your campaign on your ideas, not a party's. Run for Office with Good Party.",
  description:
    'We help independent-minded people who want to get things done run for office. Chat with an expert to learn how.',
  slug: '/run-for-office',
  image: 'https://assets.goodparty.org/dashboard.jpg',
});

export const metadata = meta;

export default async function Page(params) {
  return <RunForOfficePage />;
}
