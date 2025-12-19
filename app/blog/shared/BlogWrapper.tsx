import { fetchArticleTags } from './fetchArticleTags'
import { fetchArticlesTitles } from './fetchArticlesTitles'
import Breadcrumbs from '@shared/utils/Breadcrumbs'
import Overline from '@shared/typography/Overline'
import Body2 from '@shared/typography/Body2'
import MarketingH2 from '@shared/typography/MarketingH2'
import ExploreTags from './ExploreTags'
import MoreResources from './MoreResources'
import BlogSearch from './BlogSearch'
import BlogNavLink from './BlogNavLink'
import { ReactNode } from 'react'

interface Section {
  fields?: {
    slug?: string
    title?: string
    order?: string | number
  }
}

interface Tag {
  slug: string
  name: string
}

interface ArticleTitle {
  title: string
  slug: string
}

interface BreadcrumbLink {
  href: string
  label: string
}

interface BlogWrapperProps {
  sections: Section[]
  topTags?: Tag[]
  pageTitle: string
  pageSubtitle?: string
  pageSlug?: string
  showBreadcrumbs?: boolean
  children?: ReactNode
  allTags?: Tag[]
  articleTitles?: ArticleTitle[]
}

export default async function BlogWrapper({
  sections,
  topTags,
  pageTitle,
  pageSubtitle,
  pageSlug,
  showBreadcrumbs = true,
  children,
  allTags,
  articleTitles,
}: BlogWrapperProps): Promise<React.JSX.Element> {
  const tags = allTags || (await fetchArticleTags())
  const titles = articleTitles || (await fetchArticlesTitles())

  const breadcrumbs: BreadcrumbLink[] = [
    { href: '/blog', label: 'Blog' },
    { href: '#', label: pageTitle },
  ]

  const sortedSections = sections.sort(
    (a, b) => Number(a.fields?.order) - Number(b.fields?.order),
  )

  return (
    <>
      <div className="min-w-[400px] max-w-screen-xl mx-auto px-6 py-8">
        {showBreadcrumbs && (
          <Breadcrumbs
            links={breadcrumbs}
            delimiter="chevron"
            wrapText={true}
            className="!pt-0"
          />
        )}

        <div className="flex flex-wrap justify-between">
          <Overline className="basis-full">Categories</Overline>
          <nav className="flex flex-wrap items-center gap-2">
            <BlogNavLink href="/blog" isSelected={!pageSlug}>
              Latest Articles
            </BlogNavLink>

            {sortedSections.map((section) => (
              <BlogNavLink
                key={section.fields?.slug}
                href={`/blog/section/${section.fields?.slug}`}
                isSelected={section.fields?.slug === pageSlug}
              >
                {section.fields?.title}
              </BlogNavLink>
            ))}
          </nav>
          <BlogSearch blogItems={titles} />
        </div>

        <MarketingH2 className="mt-8 mb-4" asH1>
          {pageTitle}
        </MarketingH2>
        {pageSubtitle && <Body2 className="mb-6">{pageSubtitle}</Body2>}
        <nav className="flex flex-wrap items-center mb-6 gap-2">
          {topTags?.map((tag) => (
            <BlogNavLink
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              whiteStyle
              isSelected={tag.slug === pageSlug}
            >
              {tag.name}
            </BlogNavLink>
          ))}
        </nav>

        {children}

        <ExploreTags tags={tags} />
        <MoreResources />
      </div>
    </>
  )
}
