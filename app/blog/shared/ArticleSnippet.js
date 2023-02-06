/**
 *
 * ArticleSnippet
 *
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowNarrowRight } from 'react-icons/hi';

import styles from './ArticleSnippet.module.scss';
import TimeAgoClient from '@shared/utils/TimeAgoClient';

function ArticleSnippet({ article, heroMode }) {
  if (!article) {
    return null;
  }
  const { title, mainImage, section, publishDate, summary, readingTime, slug } =
    article;
  const sectionName = section?.fields?.title;

  return (
    <Link href={`/blog/article/${slug}`} className="no-underline">
      <article className={`${styles.wrapper} ${heroMode && styles.hero}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={heroMode ? 'lg:col-span-1' : 'lg:col-span-3'}>
            {mainImage && (
              <div
                className={`${styles.image} ${heroMode && styles.heroImage}`}
              >
                <Image
                  src={`https:${mainImage.url}`}
                  alt={mainImage.alt}
                  sizes="100vw"
                  fill
                  priority={!!heroMode}
                />
              </div>
            )}
          </div>
          <div
            className={
              heroMode && mainImage ? 'lg:col-span-2' : 'lg:col-span-3'
            }
          >
            <div className={styles.content}>
              <div>
                <div className={styles.topSection}>
                  <strong>{sectionName}</strong> &middot;{' '}
                  <TimeAgoClient date={publishDate} />
                </div>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.summary}>{summary}</p>
              </div>
              <div className={styles.bottom}>
                <div className={styles.time}>
                  {readingTime && readingTime.text}
                </div>

                <div className={styles.full}>
                  <div>Read Full &nbsp;</div> <HiArrowNarrowRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

ArticleSnippet.propTypes = {};

export default ArticleSnippet;
