import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchSections } from 'app/blog/page';
import ArticleSchema from './ArticleSchema';
import BlogArticle from './components/BlogArticle';

export const fetchArticle = async (slug) => {
  const api = { ...gpApi.content.contentByKey };
  api.url += `?key=blogArticles&subKey=slug&subValue=${slug}`;

  return await gpFetch(api, false, 3600);
};

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
