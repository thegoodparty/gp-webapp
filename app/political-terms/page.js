import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TermsHomePage from './components/TermsHomePage';
import { fetchContentByKey } from 'app/(candidate)/onboarding/[slug]/pledge/page';
import '../globals.css';

export const fetchGlossaryByLetter = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByLetter',
  };
  return await gpFetch(api, payload, 60);
};

export default async function Page() {
  const { content } = await fetchGlossaryByLetter();
  const a_items = content['A'];

  const glossaryItemsContent = await fetchContentByKey('glossaryItemsByTitle');
  const glossaryItems = glossaryItemsContent.content;

  let glossaryItemsArray = [];
  Object.keys(glossaryItems).forEach((item) => {
    glossaryItemsArray.push(glossaryItems[item].title);
  });
  glossaryItemsArray.sort();

  const recentGlossaryItemsContent = await fetchContentByKey(
    'recentGlossaryItems',
  );
  const recentGlossaryItems = recentGlossaryItemsContent.content;

  const childProps = {
    activeLetter: 'A',
    items: a_items,
    glossaryItems: glossaryItemsArray,
    recentGlossaryItems: recentGlossaryItems,
  };
  return <TermsHomePage {...childProps} />;
}
