'use client'

import { useState } from 'react'
import IconButton from '@shared/buttons/IconButton'
import MarketingH2 from '@shared/typography/MarketingH2'
import ArticleCard from 'app/blog/shared/ArticleCard'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

const PAGE_SIZE = 3

interface ArticleImage {
  url?: string
  alt?: string
}

interface RelatedArticle {
  mainImage?: ArticleImage
  title?: string
  summary?: string
  slug?: string
}

interface RelatedArticlesProps {
  articles?: RelatedArticle[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps): React.JSX.Element | null {
  const [currentPage, setCurrentPage] = useState(0)

  if (!articles || articles.length <= 0) return null

  const hasPages = articles.length > PAGE_SIZE
  const lastPage = Math.floor((articles.length - 1) / PAGE_SIZE)
  const startIndex = currentPage * PAGE_SIZE

  const incrementPage = (): void => {
    const nextPage = currentPage < lastPage ? currentPage + 1 : lastPage
    setCurrentPage(nextPage)
  }

  const decrementPage = (): void => {
    const nextPage = currentPage > 0 ? currentPage - 1 : 0
    setCurrentPage(nextPage)
  }

  return (
    <div className="py-24 px-6 lg:px-24 bg-mint-50 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <MarketingH2 className="col-span-1 lg:col-span-3 mb-2">
        You may also like...
      </MarketingH2>
      {articles
        .slice(startIndex, startIndex + PAGE_SIZE)
        .map((article, index) => {
          if (!article?.mainImage?.url) return null

          return (
            <ArticleCard
              key={index}
              title={article.title || ''}
              summary={article.summary || ''}
              imageUrl={`https:${article.mainImage.url}`}
              imageAlt={article.mainImage.alt || article.title || ''}
              linkUrl={`/blog/article/${article.slug}`}
              showReadMoreButton
            />
          )
        })}
      {hasPages && (
        <div className="text-center lg:text-left col-span-1 lg:col-span-3">
          <IconButton
            disabled={currentPage === 0}
            onClick={decrementPage}
            size="small"
          >
            <MdChevronLeft className="text-6xl" />
          </IconButton>
          <IconButton
            disabled={currentPage === lastPage}
            onClick={incrementPage}
            size="small"
          >
            <MdChevronRight className="text-6xl" />
          </IconButton>
        </div>
      )}
    </div>
  )
}
