import ArticleSchema from './ArticleSchema';
import BlogArticlePage from './components/BlogArticlePage';
import pageMetaData from 'helpers/metadataHelper';
import { redirect } from 'next/navigation';
import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticle = async (slug) => {
  const resp = await serverFetch(
    apiRoutes.content.blogArticle.getBySlug,
    {
      slug,
    },
    {
      revalidate: 3600,
    },
  );

  return resp.data;
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

// export async function generateStaticParams() {
//   const api = gpApi.content.contentByKey;

//   const { content } = await gpFetch(api, {
//     key: 'blogArticles',
//   });

//   return content?.map((article) => {
//     return {
//       slug: article.slug,
//     };
//   });
// }
