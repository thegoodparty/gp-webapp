import ArticleSnippet from '../shared/ArticleSnippet';
import BlogWrapper from '../shared/BlogWrapper';

export default function BlogPage({
  sections,
  articles,
  sectionSlug,
  sectionTitle,
}) {
  const hero = articles && articles.length > 0 ? articles[0] : false;
  return (
    <BlogWrapper
      sections={sections}
      sectionSlug={sectionSlug}
      sectionTitle={sectionTitle}
      useH1
    >
      <ArticleSnippet article={hero} heroMode />
      {articles && articles.length > 1 && (
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
      )}
    </BlogWrapper>
  );
}
