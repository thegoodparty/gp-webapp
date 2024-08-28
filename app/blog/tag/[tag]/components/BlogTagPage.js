import BlogWrapper from 'app/blog/shared/BlogWrapper';
import ArticleSnippet from 'app/blog/shared/ArticleSnippet';

export default function BlogTagPage({ sections, sectionTitle, articles }) {
  return (
    <BlogWrapper sections={sections} sectionTitle={sectionTitle}>
      <div className="border-t-[1px] border-gray-200 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
          {articles.map((article) => (
            <ArticleSnippet article={article} key={article.slug} />
          ))}
        </div>
      </div>
    </BlogWrapper>
  );
}
