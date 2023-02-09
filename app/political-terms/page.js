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
