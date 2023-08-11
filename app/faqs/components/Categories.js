import H1 from '@shared/typography/H1';
import { faqArticleRoute } from 'helpers/articleHelper';
import Link from 'next/link';

export default function Categories({ content }) {
  return (
    <div>
      <H1 className="my-6 lg:my-8" data-cy="faqs-page-title">
        Frequently Asked Questions
      </H1>
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
