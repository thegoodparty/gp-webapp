import { Fragment } from 'react';
import ArticleSnippet from '../shared/ArticleSnippet';
import BlogWrapper from '../shared/BlogWrapper';
import BlogSearch from './BlogSearch';
import SubscribeBlog from './SubscribeBlog';

function getSectionArticles(section, articles) {
  // get the first 3 articles for each section
  let sectionArticles = [];
  for (let i = 0; i < articles.length; i++) {
    if (i == 0) {
      // dont include the hero
      continue;
    }
    // console.log('articles[i]', articles[i]);
    if (articles[i]?.section?.fields?.slug === section.fields.slug) {
      sectionArticles.push(articles[i]);
    }
  }

  if (section.fields.slug === 'onboarding-live') {
    return sectionArticles.slice(0, 2);
  } else {
    return sectionArticles.slice(0, 3);
  }
}

export default function BlogPage({
  sections,
  articles,
  sectionSlug,
  sectionTitle,
  articlesTitles,
}) {
  const hero = articles && articles.length > 0 ? articles[0] : false;
  // console.log('sectionSlug', sectionSlug);
  // console.log('sections !', sections);
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
          <ArticleSnippet article={hero} heroMode />
          {sections.map((section, index) => {
            const sectionArticles = getSectionArticles(section, articles);
            return (
              <Fragment key={section.id}>
                <button
                  className={`${
                    section.fields.slug === 'onboarding-live'
                      ? 'bg-indigo-800'
                      : section.fields.slug === 'politics'
                      ? 'bg-violet-400'
                      : section.fields.slug === 'the-independent-cause'
                      ? 'bg-fuchsia-400'
                      : section.fields.slug === 'temp-section'
                      ? 'bg-orange-400'
                      : section.fields.slug === 'candidates'
                      ? 'bg-teal-400'
                      : 'bg-gray-600'
                  } py-2 px-4 mb-3 mt-10 text-sm font-bold text-white cursor-default rounded-full`}
                >
                  {section.fields.title}
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {sectionArticles.map((article) => (
                    <ArticleSnippet key={article.id} article={article} />
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
      {sectionSlug != undefined && articles && articles.length > 1 ? (
        <>
          <ArticleSnippet article={hero} heroMode />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Fragment key={article.id}>
                {index > 0 && (
                  <div>
                    <ArticleSnippet article={article} />
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
