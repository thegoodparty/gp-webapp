import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from 'app/blog/components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections, fetchArticlesTitles } from 'app/blog/page';

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

  const { titles } = await fetchArticlesTitles();

  const childProps = {
    sections,
    sectionSlug: slug,
    sectionTitle: sections[sectionIndex].fields.title,
    hero,
    sectionIndex,
    section: sections[sectionIndex],
    articlesTitles: titles,
  };

  return <BlogPage {...childProps} />;
}

export async function generateStaticParams() {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogSections',
    deleteKey: 'articles',
  };

  const { content } = await gpFetch(api, payload);

  return content.map((section) => {
    return {
      slug: section?.fields?.slug,
    };
  });
}
