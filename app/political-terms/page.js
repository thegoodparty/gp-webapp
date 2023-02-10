import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchContentByKey } from 'helpers/fetchHelper';
import TermsHomePage from './components/TermsHomePage';

export const fetchGlossaryByLetter = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByLetter',
  };
  return await gpFetch(api, payload, 60);
};

export default async function Page() {
  const { content } = await fetchGlossaryByLetter();
  const items = content['A'];

  const recentGlossaryItems = await fetchContentByKey('recentGlossaryItems');
  const recentGlossaryItemsContent = recentGlossaryItems.content;

  const childProps = {
    activeLetter: 'A',
    items,
    recentGlossaryItems: recentGlossaryItemsContent,
  };
  return <TermsHomePage {...childProps} />;
}
