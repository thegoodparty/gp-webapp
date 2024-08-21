import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import BlogWrapper from 'app/blog/shared/BlogWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import { dateUsHelper } from 'helpers/dateHelper';
import Image from 'next/image';
import styles from './BlogArticle.module.scss';
import Banner from './Banner';
import ShareBlog from 'app/blog/shared/ShareBlog';
import BlogPopup from './BlogPopup';
import ArticleTags from './ArticleTags';

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

  return (
    <>
      <BlogWrapper
        sections={sections}
        sectionSlug={sectionSlug}
        isArticle={!!title}
      >
        <BlogPopup />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-center">
          {mainImage && (
            <div>
              <div className={styles.image}>
                <Image
                  src={`https:${mainImage.url}`}
                  alt={mainImage.alt}
                  sizes="100vw"
                  fill
                  priority
                />
              </div>
            </div>
          )}
          <div>
            <ShareBlog />
            <div>
              <div className={styles.section}>{section.fields?.title}</div>
              <h1 className={styles.h1}>{title}</h1>
              <div className={styles.time}>{readingTime?.text}</div>
              <div className={styles.topAuthorWrapper}>
                <div className={styles.authorImage}>
                  {author.fields.image?.url && (
                    <Image
                      src={`https:${author.fields.image?.url}`}
                      alt={mainImage?.alt}
                      width={60}
                      height={60}
                    />
                  )}
                </div>
                <div className={styles.authorNameTop}>
                  {author.fields.name} &middot; {dateUsHelper(publishDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.maxWidth}>
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
                  <div className={styles.authorName}>
                    By {author.fields.name}
                  </div>
                  <div className={styles.authorSummary}>
                    {author.fields.summary}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlogWrapper>
    </>
  );
}
