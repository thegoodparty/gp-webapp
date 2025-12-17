import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import MaxWidth from '@shared/layouts/MaxWidth'
import contentfulHelper from 'helpers/contentfulHelper'
import Breadcrumbs from '@shared/utils/Breadcrumbs'

interface ArticleCategory {
  fields?: {
    name?: string
  }
}

interface Article {
  title: string
  articleBody: string
  category?: ArticleCategory
}

interface FaqsArticlePageProps {
  article: Article
}

export default function FaqsArticlePage({ article }: FaqsArticlePageProps): React.JSX.Element {
  const breadcrumbsLinks = [
    { href: '/', label: 'GoodParty.org' },
    {
      href: '/faqs',
      label: 'Frequently asked questions',
    },
    {
      href: '',
      label: `${article.category?.fields?.name ?? ''} - ${article.title}`,
    },
  ]

  return (
    <MaxWidth>
      <Breadcrumbs links={breadcrumbsLinks} />
      <h1
        className="text-3xl font-black mb-8 lg:text-4xl mt-12"
        data-cy="article-title"
      >
        {article.title}
      </h1>
      <CmsContentWrapper>
        {contentfulHelper(article.articleBody)}
      </CmsContentWrapper>
      <div className="h-12"></div>
    </MaxWidth>
  )
}
