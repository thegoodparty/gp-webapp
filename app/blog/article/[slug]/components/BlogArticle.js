import BlogWrapper from 'app/blog/shared/BlogWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import { dateUsHelper } from 'helpers/dateHelper';
import Image from 'next/image';
import styles from './BlogArticle.module.scss';

export default function BlogArticle({ sections, article }) {
  const { section, author, body, mainImage, publishDate, readingTime, title } =
    article;
  const sectionSlug = section?.fields?.slug;
  return (
    <BlogWrapper sections={sections} sectionSlug={sectionSlug}>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-center">
        <div>
          <div className={styles.image}>
            <Image
              src={`https:${mainImage.url}`}
              alt={mainImage.alt}
              layout="fill"
              priority
            />
          </div>
        </div>
        <div>
          <div>
            <div className={styles.section}>{section.fields?.title}</div>
            <h1 className={styles.h1}>{title}</h1>
            <div className={styles.time}>{readingTime?.text}</div>
            <div className={styles.topAuthorWrapper}>
              <div className={styles.authorImage}>
                <Image
                  src={`https:${author.fields.image.url}`}
                  alt={mainImage.alt}
                  width={60}
                  height={60}
                />
              </div>
              <div className={styles.authorNameTop}>
                {author.fields.name} &middot; {dateUsHelper(publishDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.maxWidth}>
        <div className={styles.copy}>{contentfulHelper(body)}</div>

        <div className={styles.authorWrapper}>
          <div className={styles.authorInner}>
            <div className={styles.author}>
              <div>
                <div className={styles.authorImage}>
                  <Image
                    src={`https:${author.fields.image.url}`}
                    alt={mainImage.alt}
                    width={60}
                    height={60}
                  />
                </div>
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
    </BlogWrapper>
  );
}
