import BaseButton from '@shared/buttons/BaseButton';
import BaseButtonClient from '../../shared/buttons/BaseButtonClient';
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

  if (section.fields.slug == 'onboarding-live') {
    // push a CTA here ?
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
  fullArticles,
}) {
  const hero = articles && articles.length > 0 ? articles[0] : false;
  // console.log('sectionSlug', sectionSlug);
  // console.log('sections !', sections);
  return (
    <BlogWrapper
      sections={sections}
      sectionSlug={sectionSlug}
      sectionTitle={sectionTitle}
      fullArticles={fullArticles}
      useH1
    >
      {sectionSlug == undefined && sections && sections.length > 0 && (
        <div className="grid-cols-12 col-span-12">
          <ArticleSnippet article={hero} heroMode />
          {sections.map((section) => {
            const sectionArticles = getSectionArticles(section, articles);
            return (
              <>
                <BaseButtonClient
                  className={`${
                    section.fields.slug == 'onboarding-live'
                      ? 'bg-indigo-800'
                      : section.fields.slug == 'politics'
                      ? 'bg-violet-400'
                      : section.fields.slug == 'the-independent-cause'
                      ? 'bg-fuchsia-400'
                      : section.fields.slug == 'temp-section'
                      ? 'bg-orange-400'
                      : section.fields.slug == 'candidates'
                      ? 'bg-teal-400'
                      : 'bg-gray-600'
                  } rounded-full py-2 px-4 mt-3 mb-3 text-sm font-bold text-white cursor-default`}
                >
                  {section.fields.title}
                </BaseButtonClient>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {sectionArticles.map((article) => (
                    <ArticleSnippet article={article} />
                  ))}
                  {section.fields.slug == 'onboarding-live' ? (
                    <SubscribeBlog />
                  ) : (
                    <></>
                  )}
                </div>
              </>
            );
          })}
        </div>
      )}
      {sectionSlug != undefined && articles && articles.length > 1 ? (
        <>
          <ArticleSnippet article={hero} heroMode />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <>
                {index > 0 && (
                  <div>
                    <ArticleSnippet article={article} />
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </BlogWrapper>
  );
}
