import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import { dateUsHelper } from 'helpers/dateHelper';
import Image from 'next/image';
import Banner from './Banner';
import ShareBlog from 'app/blog/shared/ShareBlog';
import BlogPopup from './BlogPopup';
import ArticleTags from './ArticleTags';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Overline from '@shared/typography/Overline';
import BlogH1 from 'app/blog/components/BlogH1';

import styles from './BlogArticle.module.scss';

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
      href: `/section/${sectionSlug}`,
      label: sectionTitle,
    },
    { label: title },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs links={breadcrumbs} delimiter="chevron" />
      <BlogPopup />
      {mainImage && (
        <div className="relative min-h-[280px] lg:min-h-[350px] w-full mb-8">
          <Image
            style={{
              'border-radius': '4px',
              'object-fit': 'cover',
              'object-position': 'center',
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
      <BlogH1>{title}</BlogH1>
      <div className="flex gap-x-6 mb-12 mt-8">
        <div className="relative h-15 w-15 rounded">
          {author.fields.image?.url && (
            <Image
              style={{
                'object-fit': 'cover',
                'object-position': 'top center',
                'border-radius': '50%',
              }}
              src={`https:${author.fields.image?.url}`}
              alt={mainImage?.alt}
              width={60}
              height={60}
            />
          )}
        </div>
        <div>
          <p className="font-medium text-lg mb-2">{author.fields.name}</p>
          <p className="font-sfpro text-gray-600 font-light text-sm">
            Published: {dateUsHelper(publishDate)}
            <br />
            Updated: {dateUsHelper(publishDate)}
          </p>
        </div>
      </div>
      <ShareBlog />
      <div className="border-t-[1px] border-gray-200 pt-8">
        <div className={styles.copy}>
          <CmsContentWrapper>{contentfulHelper(body)}</CmsContentWrapper>
          {body2 && banner && <Banner banner={banner} idIndex="1" />}
          {body2 && (
            <CmsContentWrapper>{contentfulHelper(body2)}</CmsContentWrapper>
          )}
          {banner && <Banner banner={banner} idIndex="2" />}
        </div>
        <ArticleTags tags={tags} />

        <div className={styles.authorWrapper}>
          <div className={styles.authorInner}>
            <div className={styles.author}>
              <div>
                {author.fields.image?.url && (
                  <div className={styles.authorImage}>
                    <Image
                      src={`https:${author.fields.image?.url}`}
                      alt={mainImage?.alt}
                      width={60}
                      height={60}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className={styles.authorName}>By {author.fields.name}</div>
                <div className={styles.authorSummary}>
                  {author.fields.summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
