import RunForOfficePage from './components/RunForOfficePage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Run for Office | GOOD PARTY',
  description:
    'We help independent-minded people who want to get things done run for office. Chat with an expert to learn how.',
  slug: '/run-for-office-old',
  image: 'https://assets.goodparty.org/dashboard.jpg',
});

export const metadata = meta;

export default async function Page(params) {
  return <RunForOfficePage />;
}
