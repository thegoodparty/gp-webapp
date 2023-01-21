'use client';

import Link from 'next/link';
import { useState } from 'react';

const RESOURCES_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Terms Glossary', href: '/political-terms' },
  { label: 'FAQ', href: '/faq' },
];

export default function Resources() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`ml-3 mr-6 px-1 relative cursor-pointer min-w-[84px] ${
        open ? 'underline font-black' : 'font-light'
      }`}
      onClick={() => setOpen(!open)}
    >
      Resources
      <div
        className={`absolute z-50 top-14 right-0  bg-white rounded-lg  shadow-md transition  ${
          open ? 'px-1 p-2 overflow-hidden' : 'p-0 opacity-0 overflow-visible'
        }`}
      >
        {RESOURCES_LINKS.map((link) => (
          <Link
            href={link.href}
            id={`desktop-resource-nav-${link.label.replace(' ', '-')}`}
            key={link.href}
            className="no-underline font-normal"
          >
            <div
              data-cy="header-link"
              className="py-2 whitespace-nowrap text-sm px-3 hover:bg-zinc-100 rounded"
              //   style={activeUrl === link.href ? { fontWeight: 'bold' } : {}}
            >
              {link.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
