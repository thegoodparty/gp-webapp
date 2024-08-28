import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import React from 'react';
import StickersCallout from '@shared/utils/StickersCallout';
import BlogH1 from '../components/BlogH1';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Overline from '@shared/typography/Overline';

function CategoryButton({ children, isSelected }) {
  const colorClasses = isSelected
    ? 'text-white bg-purple-500 hover:bg-purple-700'
    : 'bg-indigo-200 hover:bg-indigo-300';

  return (
    <button
      className={`rounded-md text-sm py-2 px-4 mr-2 no-underline cursor ${colorClasses}`}
    >
      {children}
    </button>
  );
}

/**
 * @typedef {Object} BlogWrapperProps
 * @property {Object[]} sections Array of sections to link to at the top of wrapper
 * @property {string} sectionSlug Slug for the currently viewed page
 * @property {string} sectionTitle Title for the currently viewed page
 */

/**
 * Wrapper element for Blog list views
 * @param {BlogWrapperProps} props
 */
export default function BlogWrapper({
  children,
  sections,
  sectionSlug,
  sectionTitle,
}) {
  const breadcrumbs = [
    { href: '/blog', label: 'Blog' },
    { label: sectionTitle },
  ];

  return (
    <>
      <StickersCallout />
      <MaxWidth className="!pt-8">
        {sectionTitle && (
          <Breadcrumbs
            links={breadcrumbs}
            delimiter="chevron"
            wrapText={true}
            className="!pt-0"
          />
        )}

        <Overline>Categories</Overline>
        <nav className="flex flex-wrap items-center gap-2 mt-2">
          <Link id="blog-home" href="/blog">
            <CategoryButton isSelected={!sectionTitle}>
              Latest Articles
            </CategoryButton>
          </Link>

          {sections.map((section, index) => (
            <Link
              key={section.fields.slug}
              href={`/blog/section/${section.fields.slug}`}
            >
              <CategoryButton isSelected={section.fields.slug === sectionSlug}>
                {section.fields.title}
              </CategoryButton>
            </Link>
          ))}
        </nav>

        <BlogH1 className="mt-8">{sectionTitle ? sectionTitle : 'Blog'}</BlogH1>
        {!sectionTitle && (
          <p className="font-light mb-6">
            Insights into politics, running for office, and the latest updates
            from the independent movement
          </p>
        )}

        {children}
      </MaxWidth>
    </>
  );
}
