import ArticleSnippet from '../shared/ArticleSnippet';
import BlogWrapper from '../shared/BlogWrapper';
import BlogSearch from './BlogSearch';

function getSectionArticles(section, articles) {
  // get the first 3 articles for each section
  let sectionArticles = [];
  for (let i = 0; i < articles.length; i++) {
    if (i == 0) {
      // dont include the hero
      continue;
    }
    if (articles[i].section.fields.slug === section.fields.slug) {
      sectionArticles.push(articles[i]);
    }
  }

  return sectionArticles.slice(0, 3);
}

export default function BlogPage({
  sections,
  articles,
  sectionSlug,
  sectionTitle,
  fullArticles,
}) {
  const hero = articles && articles.length > 0 ? articles[0] : false;

  // for (const section of sections) {
  //   const sectionArticles = getSectionArticles(section, articles);
  //   console.log('sectionArticles', sectionArticles.length);
  // }

  return (
    <BlogWrapper
      sections={sections}
      sectionSlug={sectionSlug}
      sectionTitle={sectionTitle}
      fullArticles={fullArticles}
      useH1
    >
      <ArticleSnippet article={hero} heroMode />
      {sections && sections.length > 0 && (
        <div className="grid-cols-12 col-span-12">
          {sections.map((section) => {
            const sectionArticles = getSectionArticles(section, articles);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* <h3 className="text-2xl font-bold mb-4">
                  {section.fields.title}
                </h3> */}
                {sectionArticles.map((article) => (
                  <ArticleSnippet article={article} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </BlogWrapper>
  );
}
