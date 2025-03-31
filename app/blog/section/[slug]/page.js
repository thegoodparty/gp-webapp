import { notFound } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySection } from 'app/blog/shared/fetchArticlesBySection';
import BlogSectionPage from './components/BlogSectionPage';
import { fetchArticleTags } from 'app/blog/shared/fetchArticleTags';
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles';
import { fetchSections } from 'app/blog/shared/fetchSections';
import { fetchSection } from 'app/blog/shared/fetchSection';

export const revalidate = 3600;
export const dynamic = 'force-static';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const section = await fetchSection(slug);
  const sectionTitle = section?.fields?.title || '';

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
  const [{ [slug]: articles }, tags, titles, sections] = await Promise.all([
    fetchArticlesBySection({ sectionSlug: slug }),
    fetchArticleTags(),
    fetchArticlesTitles(),
    fetchSections(),
  ]);

  const hero = articles[0];
  const currentSection = sections.find(({ fields }) => fields.slug === slug);

  const sectionTitle = currentSection.fields.title;

  return (
    <BlogSectionPage
      sections={sections}
      articles={articles.filter(
        (article) => article.contentId !== hero.contentId,
      )}
      sectionTitle={sectionTitle}
      currentSection={currentSection}
      slug={slug}
      hero={hero}
      allTags={tags}
      articleTitles={titles}
    />
  );
}

export async function generateStaticParams() {
  const sections = await fetchSections();

  return sections?.map(({ section }) => {
    return {
      slug: section?.slug,
    };
  });
}
