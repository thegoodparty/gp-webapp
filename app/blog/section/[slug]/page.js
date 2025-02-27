import { notFound } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogSectionPage from './components/BlogSectionPage';

export const revalidate = 3600;
export const dynamic = 'force-static';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { sections, sectionIndex } = await fetchArticlesBySections(slug);

  const sectionTitle = sections[sectionIndex]?.fields?.title || '';

  const meta = pageMetaData({
    title: `${sectionTitle} | GoodParty.org Blog`,
    description: `Good Part Blog ${sectionTitle} Section`,
    slug: `/blog/section/${slug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const { sections, hero, sectionIndex } = await fetchArticlesBySections(slug);
  const sectionTitle = sections[sectionIndex].fields.title;

  return (
    <BlogSectionPage
      sections={sections}
      sectionTitle={sectionTitle}
      sectionIndex={sectionIndex}
      slug={slug}
      hero={hero}
    />
  );
}

export async function generateStaticParams({ params }) {
  const { slug } = params;
  const { sections } = await fetchArticlesBySections(slug);

  return sections?.map((section) => {
    return {
      slug: section?.slug,
    };
  });
}
