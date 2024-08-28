import { Fragment } from 'react';
import Link from 'next/link';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogWrapper from './shared/BlogWrapper';
import ArticleSnippet from './shared/ArticleSnippet';
import BlogH2 from './components/BlogH2';
import SubscribeBlog from './components/SubscribeBlog';

const meta = pageMetaData({
  title: 'Blog | GoodParty.org',
  description: 'GoodParty.org Blog',
  slug: '/blog',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const { sections, hero } = await fetchArticlesBySections();

  return (
    <BlogWrapper sections={sections}>
      {sections?.length > 0 && (
        <div className="border-t-[1px] border-gray-200 pt-16 pb-8">
          <BlogH2>Featured Article</BlogH2>
          <ArticleSnippet article={hero} heroMode section={hero.section} />
          {sections.map((section, index) => {
            return (
              <Fragment key={section.id}>
                <Link
                  className="no-underline flex justify-between align-center mb-6 mt-16"
                  href={`/blog/section/${section.fields.slug}`}
                  id={`blog-${section.fields.slug}`}
                  aria-label={section.fields.title}
                >
                  <BlogH2 className="!m-0">{section.fields.title}</BlogH2>
                  <button class="text-sm text-dark bg-transparent rounded-lg py-2 px-3 hover:bg-gray-100">
                    Read More
                  </button>
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {section.articles.map((article) => (
                    <ArticleSnippet
                      key={article.id}
                      article={article}
                      section={section}
                    />
                  ))}
                </div>
              </Fragment>
            );
          })}
          {/* <SubscribeBlog className="mt-6" /> */}
        </div>
      )}
    </BlogWrapper>
  );
}
