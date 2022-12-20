import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TermsHomePage from '../components/TermsHomePage';
import TermsItemPage from './components/TermsItemPage';

// export const fetchSections = async () => {
//   const api = gpApi.content.contentByKey;
//   const payload = {
//     key: 'blogSections',
//     deleteKey: 'articles',
//   };
//   return await gpFetch(api, payload, 3600);
// };

const item = {
  title: 'Term title',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  cta: 'Click me',
  link: 'https://google.com',
};
export default async function Page({ params }) {
  const { slug } = params;
  const childProps = { item };
  if (slug.length === 1) {
    return <TermsHomePage activeLetter={slug} />;
  }
  return <TermsItemPage {...childProps} />;
}
