import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TermsHomePage from './components/TermsHomePage';
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

  const childProps = { activeLetter: 'A', items };
  return <TermsHomePage {...childProps} />;
}
