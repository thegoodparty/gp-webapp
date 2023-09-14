import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchSections } from 'app/blog/page';
import ArticleSchema from './ArticleSchema';
import BlogArticle from './components/BlogArticle';
import pageMetaData from 'helpers/metadataHelper';
import VwoScript from '@shared/scripts/VwoScript';

export const fetchArticle = async (slug) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogArticles',
    subKey: 'slug',
    subValue: slug,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { content } = await fetchArticle(slug);

  const meta = pageMetaData({
    title: `${content.title} | Good Party`,
    description: content.summary,
    image: content.mainImage && `https:${content.mainImage.url}`,
    slug: `/blog/article/${slug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  if (!slug) {
    notFound();
  }

  const { content } = await fetchArticle(slug);
  if (!content) {
    notFound();
  }

  const sectionsRes = await fetchSections();
  const sections = sectionsRes.content;

  const childProps = {
    article: content,
    sections,
  };

  return (
    <>
      <VwoScript />
      <BlogArticle {...childProps} />
      <ArticleSchema article={content} />
    </>
  );
}

export async function generateStaticParams() {
  const api = { ...gpApi.content.contentByKey };
  api.url += `?key=blogArticles`;

  const { content } = await gpFetch(api, false);

  return content.map((article) => {
    return {
      slug: article.slug,
    };
  });
}
