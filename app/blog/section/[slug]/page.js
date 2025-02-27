import { notFound } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogSectionPage from './components/BlogSectionPage';
import { fetchArticleTags } from 'app/blog/shared/fetchArticleTags';
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles';

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
  const [{ sections, hero, sectionIndex }, tags, titles] = await Promise.all([
    fetchArticlesBySections(),
    fetchArticleTags(),
    fetchArticlesTitles(),
  ]);

  const sectionTitle = sections[sectionIndex].fields.title;

  return (
    <BlogSectionPage
      sections={sections}
      sectionTitle={sectionTitle}
      sectionIndex={sectionIndex}
      slug={slug}
      hero={hero}
      allTags={tags}
      articleTitles={titles}
    />
  );
}
