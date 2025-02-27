import TermsHomePage from './components/TermsHomePage';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export async function fetchGlossaryByLetter() {
  const resp = await serverFetch(
    apiRoutes.content.glossaryByLetter,
    undefined,
    { revalidate: 3600 },
  );
  return resp.data;
}

const fetchGlossaryByTitle = async () => {
  const resp = await serverFetch(apiRoutes.content.glossaryBySlug);
  return resp.data;
};

const meta = pageMetaData({
  title: 'Political Terms & Definitions | GoodParty.org',
  description:
    'Political terms and definitions, elevate your political game with our easy to use political database at GoodParty.org',
  slug: '/political-terms',
});
export const metadata = meta;

export default async function Page() {
  const content = await fetchGlossaryByLetter();
  const a_items = content['A'];

  const glossaryItems = await fetchGlossaryByTitle();

  let glossaryItemsArray = [];
  Object.keys(glossaryItems).forEach((item) => {
    glossaryItemsArray.push(glossaryItems[item].title);
  });
  glossaryItemsArray.sort();

  const childProps = {
    activeLetter: 'A',
    items: a_items,
    glossaryItems: glossaryItemsArray,
  };
  return <TermsHomePage {...childProps} />;
}
