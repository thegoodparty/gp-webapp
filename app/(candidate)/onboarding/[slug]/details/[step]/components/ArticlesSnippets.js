import ArticleSnippet from 'app/blog/shared/ArticleSnippet';

export default function ArticlesSnippets({ articles, field }) {
  console.log('articles', articles);
  const { title, subTitle } = field;
  return (
    <div className="col-span-12 lg:min-w-[600px] lg:-ml-[120px] mx-auto mb-12">
      <h2 className="font-black text-3xl ">{title}</h2>
      {subTitle && <h3 className="zinc-500 mt-8">{subTitle}</h3>}
      <div className="mt-8 grid gap-3 grid-cols-12 items-stretch">
        {articles.map((article) => (
          <div className="col-span-12 lg:col-span-6 h-full" key={article.slug}>
            <ArticleSnippet article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
