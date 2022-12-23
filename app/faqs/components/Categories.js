import { faqArticleRoute } from 'helpers/articleHelper';
import Link from 'next/link';

export default function Categories({ content }) {
  return (
    <div>
      <h2
        className="text-3xl font-black my-6 lg:my-8 lg:text-4xl"
        data-cy="faqs-page-title"
      >
        Frequently Asked Questions
      </h2>
      {content &&
        content.map((category) => (
          <div
            className="text-xl my-2 mb-8 lg:mb-12"
            key={category.id}
            data-cy="faq-category"
          >
            <div className="mb-2" data-cy="faq-category-title">
              {category.fields.name}
            </div>
            {category.articles &&
              category.articles.map((article) => (
                <div data-cy="faq-article" key={article.id}>
                  <Link
                    href={faqArticleRoute(article)}
                    data-cy="faq-article-link"
                  >
                    <div className="py-2 pl-10" data-cy="faq-article-title">
                      {article.title}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}
