'use client';
import Link from 'next/link';
// import { JsonLd } from 'react-schemaorg';

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
      {/* <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schema,
        }}
      /> */}
      {/* <MuiBreadcrumbs aria-label="breadcrumb">
        {links.map((link, index) => (
          <span key={link.label}>
            {index < links.length - 1 && (
              <>
                {withRefresh ? (
                  <a href={link.href} key={link.href}>
                    <div className="text-xs lg:text-base">{link.label}</div>
                  </a>
                ) : (
                  <Link href={link.href} key={link.href}>
                    <div className="text-xs lg:text-base">{link.label}</div>
                  </Link>
                )}
              </>
            )}
          </span>
        ))}
      </MuiBreadcrumbs> */}
      <div className="text-xs lg:text-base">
        {links[links.length - 1].label}
      </div>
    </div>
  );
}
