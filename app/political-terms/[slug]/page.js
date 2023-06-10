import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { alphabet } from '../components/LayoutWithAlphabet';
import { fetchGlossaryByLetter } from '../page';
import TermsHomePage from '../components/TermsHomePage';
import TermsItemPage from './components/TermsItemPage';
import DefinedTermSchema from './DefinedTermSchema';
import pageMetaData from 'helpers/metadataHelper';

export const fetchGlossaryByTitle = async (title) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByTitle',
    subKey: title,
  };
  return await gpFetch(api, payload, 1); // TODO: change later when glossary CMS is stable
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { content } = await fetchGlossaryByTitle(slug);
  let meta;
  if (slug.length === 1) {
    meta = pageMetaData({
      title: `Political Terms | GOOD PARTY`,
      description:
        'Political terms and definitions, elevate your political game with our easy to use political database at Good Party',
      slug: `/political-terms/${slug}`,
    });
  } else {
    const title = content?.title;
    meta = pageMetaData({
      title: `${title} Meaning & Definition | Good Party`,
      description: `${title} meaning and definition. Find 100's of terms related to the US political system at Good Party!`,
      slug: `/political-terms/${slug}`,
    });
  }
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  let items = [];
  let activeLetter;

  if (slug != undefined) {
    const { content } = await fetchGlossaryByLetter();
    activeLetter = slug.charAt(0).toUpperCase();
    items = content[activeLetter];
  }

  if (slug.length === 1) {
    return <TermsHomePage activeLetter={activeLetter} items={items} />;
  }
  const { content } = await fetchGlossaryByTitle(slug);

  const childProps = { item: content, slug, items, activeLetter };
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
