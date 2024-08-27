import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogWrapper from 'app/blog/shared/BlogWrapper';
import BlogH2 from 'app/blog/components/BlogH2';
import ArticleSnippet from 'app/blog/shared/ArticleSnippet';

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
    <BlogWrapper
      sections={sections}
      sectionTitle={sectionTitle}
      sectionSlug={slug}
    >
      {slug && sections[sectionIndex].articles.length > 1 && (
        <div className="border-t-2 border-gray-200 pt-16 pb-8">
          <BlogH2>Featured Article</BlogH2>
          <ArticleSnippet
            article={hero}
            heroMode
            section={sections[sectionIndex]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
            {sections[sectionIndex].articles.map((article, index) => (
              <Fragment key={article.id}>
                {index > 0 && (
                  <div>
                    <ArticleSnippet
                      article={article}
                      section={sections[sectionIndex]}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </BlogWrapper>
  );
}

export async function generateStaticParams() {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogSections',
    deleteKey: 'articles',
  };

  const { content } = await gpFetch(api, payload);

  return content?.map((section) => {
    return {
      slug: section?.fields?.slug,
    };
  });
}
