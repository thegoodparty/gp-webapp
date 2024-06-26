import { TbSlash } from 'react-icons/tb';
import { JsonLd } from 'react-schemaorg';

export default function Breadcrumbs({ links }) {
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

  return (
    <div className="flex items-center whitespace-nowrap max-w-[100vw] overflow-x-auto py-6">
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
                    className="inline-flex items-center text-xs cur lg:text-base text-primary-light hover:text-primary hover:underline"
                  >
                    <div className="text-xs lg:text-base">{link.label}</div>
                  </a>

                  <TbSlash className="ml-2" />
                </div>
              )}
            </li>
          ))}
          <li>
            <div className="text-xs lg:text-base text-primary-dark">
              {links[links.length - 1].label}
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
}
