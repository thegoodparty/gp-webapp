import { MdChevronRight } from 'react-icons/md';
import { TbSlash } from 'react-icons/tb';
import { JsonLd } from 'react-schemaorg';
import clsx from 'clsx';

/**
 * @typedef {Object} BreadcrumbProps
 * @property {Object[]} links Ordered array of links to render
 * @property {string} links[].href href for link
 * @property {string} links[].label display label for link
 * @property {'slash'|'chevron'} delimiter type of delimiter character to display
 * @property {string} className extra classes to add to wrapper element
 * */

/**
 * Breadcrumb navigation with schema metadata
 * @param {BreadcrumbProps} props
 */
export default function Breadcrumbs({ links, delimiter = 'slash', className }) {
  const schema = [];
  links.forEach((link, index) => {
    schema.push({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': link.href, // || router.asPath,
        name: link.label,
      },
    });
  });

  const DelimiterComponent = delimiter === 'slash' ? TbSlash : MdChevronRight;

  return (
    <div
      className={clsx(
        'flex items-center whitespace-nowrap max-w-[100vw] overflow-x-auto py-6',
        className,
      )}
    >
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schema,
        }}
      />
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1">
          {links.map((link, index) => (
            <li key={link.label}>
              {index < links.length - 1 && (
                <div className="flex items-center">
                  <a
                    href={link.href}
                    className="inline-flex items-center cur text-base text-primary-light hover:text-primary hover:underline"
                  >
                    <div className="text-base">{link.label}</div>
                  </a>

                  <DelimiterComponent className="ml-2" />
                </div>
              )}
            </li>
          ))}
          <li>
            <div className="text-base text-primary-dark">
              {links[links.length - 1].label}
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
}
