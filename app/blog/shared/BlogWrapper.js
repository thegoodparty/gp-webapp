import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import BlogSearch from '../components/BlogSearch';
import BaseButtonClient from '../../shared/buttons/BaseButtonClient';
import styles from './BlogWrapper.module.scss';
import { colors } from './BlogColors';
import StickersCallout from '@shared/utils/StickersCallout';

export default function BlogWrapper({
  children,
  sections,
  useH1,
  sectionSlug,
  sectionTitle,
  articlesTitles,
  isArticle,
}) {
  return (
    <>
      <StickersCallout />
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-9">
            <div>
              {useH1 && !sectionTitle ? (
                <h1 className={styles.blogTitle}>Blog</h1>
              ) : (
                <h2 className={styles.blogTitle}>Blog</h2>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 pb-5 lg:pt-10">
            <BlogSearch blogItems={articlesTitles} />
          </div>
        </div>

        <div className={styles.sectionsSlugWrapper}>
          <div className={styles.sectionsSlug}>
            <Link
              id="blog-home"
              href="/blog"
              className="inline-flex"
              aria-label="Blog Homepage"
            >
              <BaseButtonClient
                style={{ backgroundColor: '#000', color: '#ffffff' }}
                className="py-3 px-4 mb-3 ml-3 mr-3 font-bold"
              >
                <AiOutlineHome size={18} />
              </BaseButtonClient>
            </Link>
            {sections.map((section, index) => (
              <React.Fragment key={section.fields.slug}>
                {section.fields.slug === sectionSlug ? (
                  <Link
                    className={styles.section}
                    href={
                      isArticle ? `/blog/section/${section.fields.slug}` : '#'
                    }
                  >
                    <BaseButtonClient
                      className={`${
                        index <= 4 ? colors[index] : 'bg-primary-dark'
                      } py-3 px-4 mb-3 mr-3 font-bold text-white rounded-full`}
                    >
                      {section.fields.title}
                    </BaseButtonClient>
                  </Link>
                ) : (
                  <Link
                    id={`blog-section-${section.fields.slug}`}
                    href={`/blog/section/${section.fields.slug}`}
                    key={section.id}
                    className={styles.section}
                  >
                    <BaseButtonClient
                      className={`${
                        !sectionTitle && index <= 4
                          ? colors[index]
                          : 'bg-gray-800'
                      } py-3 px-4 mb-3 mr-3 font-bold text-white rounded-full`}
                    >
                      {section.fields.title}
                    </BaseButtonClient>
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
    </>
  );
}
