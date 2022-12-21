import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TermsHomePage from '../components/TermsHomePage';
import { fetchGlossaryByLetter } from '../page';
import TermsItemPage from './components/TermsItemPage';

export const fetchGlossaryByTitle = async (title) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByTitle',
    subKey: title,
  };
  return await gpFetch(api, payload, 60);
};

export default async function Page({ params }) {
  const { slug } = params;
  if (slug.length === 1) {
    const { content } = await fetchGlossaryByLetter();
    const items = content[slug.toUpperCase()];
    return <TermsHomePage activeLetter={slug.toUpperCase()} items={items} />;
  }
  const { content } = await fetchGlossaryByTitle(slug);
  const childProps = { item: content };
  return <TermsItemPage {...childProps} />;
}
