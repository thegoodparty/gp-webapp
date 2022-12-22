import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { alphabet } from '../components/LayoutWithAlphabet';
import TermsHomePage from '../components/TermsHomePage';
import { fetchGlossaryByLetter } from '../page';
import TermsItemPage from './components/TermsItemPage';
import DefinedTermSchema from './DefinedTermSchema';

export const fetchGlossaryByTitle = async (title) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByTitle',
    subKey: title,
  };
  return await gpFetch(api, payload, 1); // TODO: change later when glossary CMS is stable
};

export default async function Page({ params }) {
  const { slug } = params;
  if (slug.length === 1) {
    const { content } = await fetchGlossaryByLetter();
    const items = content[slug.toUpperCase()];
    return <TermsHomePage activeLetter={slug.toUpperCase()} items={items} />;
  }
  const { content } = await fetchGlossaryByTitle(slug);
  const childProps = { item: content, slug };
  return (
    <>
      <TermsItemPage {...childProps} />
      <DefinedTermSchema {...childProps} />
    </>
  );
}

export async function generateStaticParams() {
  const letters = alphabet;

  return letters.map((letter) => {
    return {
      slug: letter,
    };
  });
}
