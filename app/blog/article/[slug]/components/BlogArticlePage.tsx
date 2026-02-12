import contentfulHelper from 'helpers/contentfulHelper'
import Image from 'next/image'
import Banner from './Banner'
import ShareBlog from 'app/blog/shared/ShareBlog'
import BlogPopup from './BlogPopup'
import ArticleTags from './ArticleTags'
import Breadcrumbs from '@shared/utils/Breadcrumbs'
import Overline from '@shared/typography/Overline'
import MarketingH2 from '@shared/typography/MarketingH2'
import BlogAuthor from './BlogAuthor'
import BlogAuthorFooter from './BlogAuthorFooter'
import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import ArticleFaqs from './ArticleFaqs'
import ScrollToTop from './ScrollToTop'
import RelatedArticles from './RelatedArticles'
import Link from 'next/link'
import { MdOpenInNew } from 'react-icons/md'
import IconButton from '@shared/buttons/IconButton'
import Body1 from '@shared/typography/Body1'
import HighlightedContent from './HighlightedContent'
import { ArticleContent } from '../utils'

interface BlogArticlePageProps {
  article: ArticleContent
}

export default async function BlogArticlePage({
  article,
}: BlogArticlePageProps): Promise<React.JSX.Element> {
  const {
    section,
    author,
    body,
    body2,
    banner,
    mainImage,
    publishDate,
    updateDate,
    title,
    tags,
    keyInformation,
    endHighlight,
    relatedArticles,
    references,
  } = article

  const sectionSlug = section?.fields?.slug || ''
  const sectionTitle = section?.fields?.title || 'Section'
  const breadcrumbs = [
    { href: '/blog', label: 'Blog' },
    {
      href: `/blog/section/${sectionSlug}`,
      label: sectionTitle,
    },
    { href: '', label: title || '' },
  ]

  return (
    <>
      <article id="article-top" className="max-w-[800px] mx-auto px-6 py-8">
        <BlogPopup />
        <Breadcrumbs
          className="!p-0"
          links={breadcrumbs}
          delimiter="chevron"
          wrapText={true}
        />
        {mainImage?.url && (
          <div
            className="relative min-h-[270px] w-full my-8"
            data-testid="articleHeroImage"
          >
            <Image
              style={{
                borderRadius: '10px',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              src={`https:${mainImage.url}`}
              alt={mainImage.alt || ''}
              sizes="100vw"
              fill
              priority
            />
          </div>
        )}
        <Overline
          className="inline-block bg-purple-500 text-white px-2 py-1 rounded"
          data-testid="articleCategory"
        >
          {section?.fields?.title}
        </Overline>
        <MarketingH2 className="mt-8 mb-4 !text-4xl" asH1>
          {title}
        </MarketingH2>
        <div className="md:flex items-center justify-between">
          {author?.fields?.name && (
            <BlogAuthor
              imageUrl={
                author?.fields?.image?.fields?.file?.url
                  ? `https:${author.fields.image.fields.file.url}`
                  : undefined
              }
              name={author.fields.name}
              publishDate={publishDate || ''}
              updateDate={updateDate}
            />
          )}
          <ShareBlog />
        </div>
        <div className="border-y border-gray-200 py-8">
          <div>
            {keyInformation && keyInformation.length > 0 && (
              <HighlightedContent className="mt-0">
                <Overline>Key Information</Overline>
                <ul className="list-outside mb-0 [&>li]:leading-6">
                  {keyInformation.map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </HighlightedContent>
            )}
            <CmsContentWrapper>{contentfulHelper(body)}</CmsContentWrapper>
            {Boolean(body2) && banner && <Banner banner={banner} idIndex="1" />}
            {Boolean(body2) && (
              <CmsContentWrapper>{contentfulHelper(body2)}</CmsContentWrapper>
            )}
            {Boolean(endHighlight) && (
              <HighlightedContent>
                {contentfulHelper(endHighlight)}
              </HighlightedContent>
            )}
          </div>
          <ShareBlog className="mt-8" />
          {banner && <Banner banner={banner} idIndex="2" />}
          <ArticleFaqs />
          {references && references.length > 0 && (
            <div className="py-6 px-8 mb-8 bg-blue-50 rounded">
              <Overline>Reference</Overline>

              {references.map(({ name, description, url }) => (
                <div key={name + url} className="mt-4">
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group underline inline-flex items-center text-xl text-blue"
                  >
                    {name}
                    <IconButton className="ml-1 group-hover:bg-indigo-700/[0.08]">
                      <MdOpenInNew className="text-2xl" />
                    </IconButton>
                  </Link>
                  {description && (
                    <Body1 className="mt-1 basis-full text-gray-600">
                      {description}
                    </Body1>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <ArticleTags tags={tags} />
            <ScrollToTop />
          </div>
        </div>
        {author?.fields?.name && (
          <BlogAuthorFooter
            imageUrl={
              author?.fields?.image?.fields?.file?.url
                ? `https:${author.fields.image.fields.file.url}`
                : undefined
            }
            name={author.fields.name}
            summary={author?.fields?.summary || ''}
          />
        )}
      </article>
      {relatedArticles && <RelatedArticles articles={relatedArticles} />}
    </>
  )
}
