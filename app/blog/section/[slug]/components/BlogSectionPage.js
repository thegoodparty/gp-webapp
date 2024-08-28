import { Fragment } from 'react';
import BlogWrapper from 'app/blog/shared/BlogWrapper';
import ArticleSnippet from 'app/blog/shared/ArticleSnippet';
import MarketingH5 from '@shared/typography/MarketingH5';

export default function BlogSectionPage({
  sections,
  sectionTitle,
  sectionIndex,
  slug,
  hero,
}) {
  return (
    <BlogWrapper
      sections={sections}
      sectionTitle={sectionTitle}
      sectionSlug={slug}
    >
      {slug && sections[sectionIndex].articles.length > 1 && (
        <div className="border-t-[1px] border-gray-200 pt-16 pb-8">
          <MarketingH5 className="mb-6">Featured Article</MarketingH5>
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
