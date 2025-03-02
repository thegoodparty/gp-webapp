import { fetchArticleTags } from './fetchArticleTags';
import { fetchArticlesTitles } from './fetchArticlesTitles';
import StickersCallout from '@shared/utils/StickersCallout';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Overline from '@shared/typography/Overline';
import Body2 from '@shared/typography/Body2';
import MarketingH2 from '@shared/typography/MarketingH2';
import ExploreTags from './ExploreTags';
import MoreResources from './MoreResources';
import BlogSearch from './BlogSearch';
import BlogNavLink from './BlogNavLink';

/**
 * @typedef {Object} BlogWrapperProps
 * @property {Object[]} sections Array of sections to link to at the top of wrapper
 * @property {Object[]} topTags Array of tags + slugs to render under Heading
 * @property {string} pageTitle Title for the currently viewed page
 * @property {string} pageSubtitle Subtitle for the currently viewed page
 * @property {string} pageSlug Slug for the currently viewed page
 * @property {boolean} showBreadcrumbs Bool to display or hide breadcrumbs
 */

/**
 * Wrapper element for Blog list views
 * @param {BlogWrapperProps} props
 */
export default async function BlogWrapper({
  sections,
  topTags,
  pageTitle,
  pageSubtitle,
  pageSlug,
  showBreadcrumbs = true,
  children,
  allTags,
  articleTitles,
}) {
  const tags = allTags || (await fetchArticleTags());
  const titles = articleTitles || (await fetchArticlesTitles());

  const breadcrumbs = [{ href: '/blog', label: 'Blog' }, { label: pageTitle }];

  // ensure sections are ordered correctly
  const sortedSections = sections.sort(
    (a, b) => Number(a.fields?.order) - Number(b.fields?.order),
  );

  return (
    <>
      <StickersCallout />
      <div className="min-w-[400px] max-w-screen-xl mx-auto px-6 py-8">
        {showBreadcrumbs && (
          <Breadcrumbs
            links={breadcrumbs}
            delimiter="chevron"
            wrapText={true}
            className="!pt-0"
          />
        )}

        <div className="flex flex-wrap justify-between">
          <Overline className="basis-full">Categories</Overline>
          <nav className="flex flex-wrap items-center gap-2">
            <BlogNavLink href="/blog" isSelected={!pageSlug}>
              Latest Articles
            </BlogNavLink>

            {sortedSections.map((section) => (
              <BlogNavLink
                key={section.fields.slug}
                href={`/blog/section/${section.fields.slug}`}
                isSelected={section.fields.slug === pageSlug}
              >
                {section.fields.title}
              </BlogNavLink>
            ))}
          </nav>
          <BlogSearch blogItems={titles} />
        </div>

        <MarketingH2 className="mt-8 mb-4" asH1>
          {pageTitle}
        </MarketingH2>
        {pageSubtitle && <Body2 className="mb-6">{pageSubtitle}</Body2>}
        <nav className="flex flex-wrap items-center mb-6 gap-2">
          {topTags?.map((tag) => (
            <BlogNavLink
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              whiteStyle
              isSelected={tag.slug === pageSlug}
            >
              {tag.name}
            </BlogNavLink>
          ))}
        </nav>

        {children}

        <ExploreTags tags={tags} />
        <MoreResources />
      </div>
    </>
  );
}
