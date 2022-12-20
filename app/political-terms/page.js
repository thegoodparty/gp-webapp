import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TermsHomePage from './components/TermsHomePage';

export const fetchSections = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogSections',
    deleteKey: 'articles',
  };
  return await gpFetch(api, payload, 3600);
};

export default async function Page() {
  const childProps = { activeLetter: 'A' };
  return <TermsHomePage {...childProps} />;
}
