import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import contentfulHelper from 'helpers/contentfulHelper';

export default function FaqsArticlePage({ article }) {
  const breadcrumbsLinks = [
    { href: '/', label: 'Good Party' },
    {
      href: '/faqs',
      label: 'Frequently asked questions',
    },
    {
      label: `${article.category?.fields?.name ?? ''} - ${article.title}`,
    },
  ];

  return (
    <MaxWidth>
      <Breadcrumbs links={breadcrumbsLinks} />
      {/* <h1
        className="text-3xl font-black mb-8 lg:text-4xl"
        data-cy="article-title"
      >
        {article.title}
      </h1>
      <CmsContentWrapper>
        {contentfulHelper(article.articleBody)}
      </CmsContentWrapper>
      <div className="h-12"></div> */}
    </MaxWidth>
  );
}
