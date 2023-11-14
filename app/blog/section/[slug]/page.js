import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from 'app/blog/components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';
import VwoScript from '@shared/scripts/VwoScript';
import { fetchArticlesTitles } from 'app/blog/page';

export const fetchSections = async (slug) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogSections',
  };
  const { content } = await gpFetch(api, payload, 3600);
  let articles = [];
  let sectionTitle;
  let sectionId;
  for (let i = 0; i < content.length; i++) {
    const section = content[i];
    if (section.fields?.slug === slug) {
      sectionId = i;
      articles = section.articles;
      sectionTitle = section.fields.title;
      break;
    }
  }

  return {
    sections: content,
    sectionSlug: slug,
    articles,
    sectionTitle,
    sectionId,
  };
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { sections, sectionSlug, articles, sectionTitle } = await fetchSections(
    slug,
  );

  const meta = pageMetaData({
    title: `${sectionTitle} | Good Party Blog`,
    description: `Good Part Blog ${sectionTitle} Section`,
    slug: `/blog/section/${sectionSlug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  if (!slug) {
    notFound();
  }

  const { sections, sectionSlug, articles, sectionTitle, sectionId } =
    await fetchSections(slug);
  const hero = articles && articles.length > 0 ? articles[0] : false;
  const { titles } = await fetchArticlesTitles();

  const childProps = {
    sections,
    sectionSlug,
    articles,
    sectionTitle,
    hero,
    sectionId,
    section: { fields: { title: sections[sectionId].fields.title } },
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
      slug: section.fields.slug,
    };
  });
}
