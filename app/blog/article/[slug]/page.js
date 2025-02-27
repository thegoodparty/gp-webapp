import ArticleSchema from './ArticleSchema';
import BlogArticlePage from './components/BlogArticlePage';
import pageMetaData from 'helpers/metadataHelper';
import { redirect } from 'next/navigation';
import { apiFetch } from 'gpApi/apiFetch';
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles';

export const revalidate = 3600;
export const dynamic = 'force-static';

export const fetchArticle = async (slug) => {
  return await apiFetch(`content/blog-article/${slug}`);
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const content = await fetchArticle(slug);

  const meta = pageMetaData({
    title: `${content?.title} | GoodParty.org`,
    description: content.summary,
    image: content.mainImage && `https:${content?.mainImage?.url}`,
    slug: `/blog/article/${slug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  if (!slug) {
    redirect('/blog');
  }

  const content = await fetchArticle(slug);

  if (!content) {
    redirect('/blog');
  }

  return (
    <>
      <BlogArticlePage article={content} />
      <ArticleSchema article={content} />
    </>
  );
}

export async function generateStaticParams({ params }) {
  const articles = await fetchArticlesTitles();

  return articles?.map((article) => {
    return {
      slug: article?.slug,
    };
  });
}
