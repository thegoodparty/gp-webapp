// 'use client';
import Link from 'next/link';
import { MdOutlineChevronRight } from 'react-icons/md';
import { TbSlash } from 'react-icons/tb';
import { JsonLd } from 'react-schemaorg';

// import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

export default function Breadcrumbs({ links, withRefresh = false }) {
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
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1">
          {links.map((link, index) => (
            <li key={link.label}>
              {index < links.length - 1 && (
                <div class="flex items-center">
                  {withRefresh ? (
                    <a
                      href={link.href}
                      class="inline-flex items-center text-xs lg:text-base text-indigo-400 hover:text-indigo-800 hover:underline"
                    >
                      <div className="text-xs lg:text-base">{link.label}</div>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      class="inline-flex items-center text-xs lg:text-base text-indigo-400 hover:text-indigo-800 hover:underline"
                    >
                      <div className="text-xs lg:text-base">{link.label}</div>
                    </Link>
                  )}
                  <TbSlash className="ml-2" />
                </div>
              )}
            </li>
          ))}
          <li>
            <div className="text-xs lg:text-base text-indigo-800">
              {links[links.length - 1].label}
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
}
