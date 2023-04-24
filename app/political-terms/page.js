import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchContentByKey } from 'helpers/fetchHelper';
import TermsHomePage from './components/TermsHomePage';
import pageMetaData from 'helpers/metadataHelper';

export async function fetchGlossaryByLetter() {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByLetter',
  };
  return await gpFetch(api, payload, 60);
}

const meta = pageMetaData({
  title: 'Political Terms & Definitions | Good Party',
  description:
    'Political terms and definitions, elevate your political game with our easy to use political database at Good Party',
  slug: '/political-terms',
});
export const metadata = meta;

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
