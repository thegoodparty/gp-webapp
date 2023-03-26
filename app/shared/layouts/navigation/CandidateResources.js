'use client';

import Link from 'next/link';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { FiChevronDown } from 'react-icons/fi';

export const CANDIDATE_RESOURCES_LINKS = [
  { label: 'Run for office', href: '/run-for-office' },
  { label: 'Good Party Academy', href: '/academy' },
];

export default function CandidateResources() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`mr-6 px-1 relative cursor-pointer min-w-[100px] ${
        open ? 'underline font-black' : 'font-light'
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center">
        Candidate Resources{' '}
        <FiChevronDown
          className={`ml-1 transition-all ${open && 'rotate-180'}`}
        />
      </div>
      <Backdrop
        open={open}
        className="opacity-0"
        style={{ opacity: 0 }}
        onClick={() => {
          () => setOpen(false);
        }}
      ></Backdrop>
      {open && (
        <div
          className={`absolute z-50 top-14 right-0  bg-white rounded-lg  shadow-md transition  ${
            open ? 'px-1 p-2 overflow-hidden' : 'p-0 opacity-0 overflow-visible'
          }`}
        >
          {CANDIDATE_RESOURCES_LINKS.map((link) => (
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
      )}
    </div>
  );
}
