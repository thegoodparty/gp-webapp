import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
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

export const fetchArticles = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogArticles',
    limit: 3,
  };
  return await gpFetch(api, payload, 3600);
};

export default async function Page(params) {
  const articlesRes = await fetchArticles();
  const fullArticles = articlesRes.content;
  const articles = fullArticles.slice(0, 3);

  const childProps = {
    articles,
  };
  return <RunForOfficePage {...childProps} />;
}
