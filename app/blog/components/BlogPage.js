import { Fragment } from 'react';
import ArticleSnippet from '../shared/ArticleSnippet';
import BlogWrapper from '../shared/BlogWrapper';
import SubscribeBlog from './SubscribeBlog';
import Link from 'next/link';
import { colors } from '../shared/BlogColors';

export default function BlogPage({
  sections,
  hero,
  sectionSlug,
  sectionTitle,
  sectionId,
  articlesTitles,
}) {
  return (
    <BlogWrapper
      sections={sections}
      sectionSlug={sectionSlug}
      sectionTitle={sectionTitle}
      articlesTitles={articlesTitles}
      useH1
    >
      {sectionSlug === undefined && sections && sections.length > 0 && (
        <div className="grid-cols-12 col-span-12">
          <ArticleSnippet article={hero} heroMode section={hero.section} />
          {sections.map((section, index) => {
            return (
              <Fragment key={section.id}>
                <Link
                  href={`/blog/section/${section.fields.slug}`}
                  id={`blog-${section.fields.slug}`}
                  aria-label={section.fields.title}
                >
                  <button
                    className={`${
                      index <= 3 ? colors[index] : 'bg-indigo-800'
                    } py-2 px-4 mb-3 mt-10 text-sm font-bold text-white cursor-pointer rounded-full`}
                  >
                    {section.fields.title}
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
                  {section.fields.slug == 'onboarding-live' ? (
                    <SubscribeBlog />
                  ) : (
                    <></>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      )}
      {sectionSlug && sections[0].articles.length > 1 ? (
        <>
          <ArticleSnippet
            article={hero}
            heroMode
            section={sections[sectionId]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sections[sectionId].articles.map((article, index) => (
              <Fragment key={article.id}>
                {index > 0 && (
                  <div>
                    <ArticleSnippet
                      article={article}
                      section={sections[sectionId]}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </BlogWrapper>
  );
}
