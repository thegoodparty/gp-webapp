import { Fragment } from 'react';
import BlogWrapper from 'app/blog/shared/BlogWrapper';
import ArticleSnippet from 'app/blog/shared/ArticleSnippet';
import MarketingH5 from '@shared/typography/MarketingH5';
import SubscribeBlog from 'app/blog/shared/SubscribeBlog';
import LoadMoreWrapper from 'app/blog/shared/LoadMoreWrapper';

export const FIRST_PAGE_SIZE = 15;

export default function BlogSectionPage({
  sections,
  sectionIndex,
  slug,
  hero,
  allTags,
  articleTitles,
}) {
  const section = sections[sectionIndex];
  const articles = section.articles;
  const firstPageArticles = articles.slice(0, FIRST_PAGE_SIZE);
  const loadMoreArticles = articles.slice(FIRST_PAGE_SIZE);

  function renderArticles(items, showSubscribe) {
    return items.map((item, index) => (
      <Fragment key={item.id}>
        <ArticleSnippet article={item} section={section} />
        {showSubscribe && index === 2 && (
          <SubscribeBlog className="col-span-1 lg:col-span-3" />
        )}
      </Fragment>
    ));
  }

  return (
    <BlogWrapper
      sections={sections}
      topTags={section.tags}
      pageTitle={section.fields.title}
      pageSubtitle={section.fields.subtitle}
      pageSlug={slug}
      allTags={allTags}
      articleTitles={articleTitles}
    >
      {slug && articles.length > 1 && (
        <div className="border-t border-gray-200 py-16">
          <MarketingH5 className="mb-6">Featured Article</MarketingH5>
          <ArticleSnippet article={hero} heroMode section={section} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
            {renderArticles(firstPageArticles, true)}
          </div>
          {loadMoreArticles?.length > 0 && (
            <LoadMoreWrapper className="mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
                {renderArticles(loadMoreArticles, false)}
              </div>
            </LoadMoreWrapper>
          )}
        </div>
      )}
    </BlogWrapper>
  );
}
