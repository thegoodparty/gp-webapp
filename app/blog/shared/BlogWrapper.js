import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';

import styles from './BlogWrapper.module.scss';

export default function BlogWrapper({
  children,
  sections,
  useH1,
  sectionSlug,
  sectionTitle,
}) {
  return (
    <MaxWidth>
      <div>
        {useH1 && !sectionTitle ? (
          <h1 className={styles.blogTitle}>Blog</h1>
        ) : (
          <h2 className={styles.blogTitle}>Blog</h2>
        )}
      </div>
      <div className={styles.sectionsWrapper}>
        <div className={styles.sections}>
          <Link href="/blog" className="inline-flex">
            <AiOutlineHome size={18} />
          </Link>
          {sections.map((section) => (
            <React.Fragment key={section.fields.slug}>
              {section.fields.slug === sectionSlug ? (
                <div className={`${styles.section} ${styles.active}`}>
                  {section.fields.title}
                </div>
              ) : (
                <Link
                  href={`/blog/section/${section.fields.slug}`}
                  key={section.id}
                  className={styles.section}
                >
                  {section.fields.title}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {sectionTitle && (
        <div className={styles.titleWrapper}>
          <h1 className={styles.sectionTitle}>
            <span className={styles.up}>{sectionTitle}</span>
            <span className={styles.yellow} />
          </h1>
        </div>
      )}
      {children}
      <div className="mb-6"></div>
    </MaxWidth>
  );
}
