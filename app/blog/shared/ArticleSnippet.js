import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dateUsHelper } from 'helpers/dateHelper';
import Overline from '@shared/typography/Overline';
import clsx from 'clsx';

/**
 * @typedef {Object} ArticleSnippetProps
 * @property {Object} article Article object to render
 * @property {boolean} heroMode Render snippet styled as a hero element
 * @property {Object} section Section object article belongs to
 */

/**
 * UI for embedded article previews
 * @param {ArticleSnippetProps} props
 */

export default function ArticleSnippet({
  article,
  heroMode,
  section,

  // minimal NOTE: was not being used anywhere
  // target = false, NOTE: does not seem to be used anywhere, default false value throws error when being applied to Link.target prop
}) {
  if (!article) {
    return null;
  }

  const { title, mainImage, publishDate, summary, slug } = article;
  const sectionName = section?.fields?.title;

  return (
    <Link id={slug} href={`/blog/article/${slug}`} className="no-underline">
      <article
        className={clsx('h-full', {
          ['mb-16 bg-indigo-100 p-8 rounded-2xl']: heroMode,
        })}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={heroMode ? 'lg:col-span-1' : 'lg:col-span-3'}>
            {mainImage && (
              <div
                className={clsx(
                  'relative w-full',
                  heroMode ? 'min-h-[280px]' : 'min-h-[200px]',
                )}
              >
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
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
              heroMode && mainImage
                ? 'lg:col-span-2 self-center'
                : 'lg:col-span-3'
            }
          >
            {heroMode ? (
              <div className="lg:ml-8">
                <h3 className="mb-2 font-medium text-4xl">{title}</h3>
                <p className="font-light">{summary}</p>
                <button className="bg-indigo-700 mt-6 px-6 py-3 text-white rounded-lg w-full md:w-auto hover:bg-indigo-900">
                  Read More
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full">
                {sectionName && <Overline>{sectionName}</Overline>}
                <h3 className="my-2 font-medium text-2xl">{title}</h3>
                <p className="font-light font-sfpro text-base">
                  {dateUsHelper(publishDate, 'long')}
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
