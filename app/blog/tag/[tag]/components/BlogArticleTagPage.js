import ArticleSnippet from 'app/blog/shared/ArticleSnippet';
import BlogWrapper from 'app/blog/shared/BlogWrapper';

export default function BlogArticleTagPage({ sections, tagName, articles }) {
  if (!articles) {
    return null;
  }
  return (
    <BlogWrapper sections={sections} sectionTitle={tagName} useH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleSnippet article={article} key={article.slug} />
        ))}
      </div>
    </BlogWrapper>
  );
}
