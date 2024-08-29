import contentfulHelper from 'helpers/contentfulHelper';
import Image from 'next/image';
import Banner from './Banner';
import ShareBlog from 'app/blog/shared/ShareBlog';
import BlogPopup from './BlogPopup';
import ArticleTags from './ArticleTags';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Overline from '@shared/typography/Overline';
import MarketingH2 from '@shared/typography/MarketingH2';
import BlogAuthor from './BlogAuthor';
import BlogAuthorFooter from './BlogAuthorFooter';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';

export default function BlogArticle({ sections, article }) {
  const {
    section,
    author,
    body,
    body2,
    banner,
    mainImage,
    publishDate,
    readingTime,
    title,
    tags,
  } = article;
  const sectionSlug = section?.fields?.slug;
  const sectionTitle = section?.fields?.title;

  const breadcrumbs = [
    { href: '/blog', label: 'Blog' },
    {
      href: `/blog/section/${sectionSlug}`,
      label: sectionTitle,
    },
    { label: title },
  ];

  return (
    <article className="max-w-[800px] mx-auto px-6 py-8">
      <BlogPopup />
      <Breadcrumbs
        className="!p-0"
        links={breadcrumbs}
        delimiter="chevron"
        wrapText={true}
      />
      {mainImage && (
        <div className="relative min-h-[270px] w-full my-8">
          <Image
            style={{
              borderRadius: '10px',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            src={`https:${mainImage.url}`}
            alt={mainImage.alt}
            sizes="100vw"
            fill
            priority
          />
        </div>
      )}
      <Overline className="inline-block bg-purple-500 text-white px-2 py-1 rounded">
        {section.fields?.title}
      </Overline>
      <MarketingH2 className="mt-8 mb-4 !text-4xl" asH1>
        {title}
      </MarketingH2>
      <div class="md:flex items-center justify-between">
        <BlogAuthor
          imageUrl={author.fields.image?.url}
          name={author.fields.name}
          publishDate={publishDate}
          // updateDate={publishDate}
        />
        <ShareBlog />
      </div>
      <div className="border-t-[1px] border-b-[1px] border-gray-200 py-8">
        <div>
          <CmsContentWrapper>{contentfulHelper(body)}</CmsContentWrapper>
          {body2 && banner && <Banner banner={banner} idIndex="1" />}
          {body2 && (
            <CmsContentWrapper>{contentfulHelper(body2)}</CmsContentWrapper>
          )}
          {banner && <Banner banner={banner} idIndex="2" />}
        </div>
        <ArticleTags tags={tags} />
      </div>
      <BlogAuthorFooter
        imageUrl={author.fields.image?.url}
        name={author.fields.name}
        summary={author.fields.summary}
        asFooter={true}
      />
    </article>
  );
}
