import { fetchGlossaryByLetter } from '../page';
import TermsHomePage from '../components/TermsHomePage';
import TermsItemPage from './components/TermsItemPage';
import DefinedTermSchema from './DefinedTermSchema';
import pageMetaData from 'helpers/metadataHelper';
import { notFound } from 'next/navigation';

const fetchGlossaryBySlug = async (slug) => {
  try {
    return await apiFetch('content/type/glossaryItem/by-slug');
  } catch (e) {
    return {};
  }
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const content = await fetchGlossaryBySlug(slug);
  let meta;
  if (slug.length === 1) {
    meta = pageMetaData({
      title: `Political Terms - ${slug.toUpperCase()} | GoodParty.org`,
      description:
        'Political terms and definitions, elevate your political game with our easy to use political database at GoodParty.org',
      slug: `/political-terms/${slug}`,
    });
  } else {
    if (!content) {
      notFound();
    }
    const title = content?.title;
    meta = pageMetaData({
      title: `${title} Meaning & Definition | GoodParty.org`,
      description: `${title} meaning and definition. Find 100's of terms related to the US political system at GoodParty.org!`,
      slug: `/political-terms/${slug}`,
    });
  }
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const activeLetter = slug.charAt(0).toUpperCase();
  const content = await fetchGlossaryByLetter();
  const items = content[activeLetter] || [];
  if (slug.length === 1) {
    return <TermsHomePage activeLetter={activeLetter} items={items} />;
  }
  const titleContent = await fetchGlossaryBySlug(slug);
  const childProps = { item: titleContent, slug, activeLetter, items };

  return (
    <>
      <TermsItemPage {...childProps} />
      <DefinedTermSchema {...childProps} />
    </>
  );
}

export async function generateStaticParams() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const lettersArray = letters.split('');

  return lettersArray.map((letter) => {
    return {
      slug: letter,
    };
  });
}
