'use client';

import Link from 'next/link';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { FiChevronDown } from 'react-icons/fi';

export const RESOURCES_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Terms Glossary', href: '/political-terms' },
  { label: 'FAQ', href: '/faqs' },
  { label: 'Volunteer', href: '/volunteer' },
];

export const CANDIDATE_RESOURCES_LINKS = [
  { label: 'Run for office', href: '/run-for-office' },
  { label: 'Good Party Academy', href: '/academy' },
];

export default function Resources() {
  const [open, setOpen] = useState(false);
  const [candidateOpen, setCandidateOpen] = useState(false);

  const handleOpen = () => {
    console.log('at handle open');
    setCandidateOpen(false);
    setOpen(true);
  };

  const handleCandOpen = () => {
    setOpen(false);
    setCandidateOpen(true);
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
    } else {
      handleOpen();
    }
  };

  const handleCandToggle = () => {
    if (candidateOpen) {
      setCandidateOpen(false);
    } else {
      handleCandOpen();
    }
  };

  return (
    <>
      <div
        className={`ml-3 mr-6 px-1 relative cursor-pointer min-w-[100px] ${
          open ? 'underline font-black' : 'font-light'
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center">
          Resources{' '}
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
              open
                ? 'px-1 p-2 overflow-hidden'
                : 'p-0 opacity-0 overflow-visible'
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
        )}
      </div>

      <div
        className={`mr-6 px-1 relative cursor-pointer min-w-[100px] ${
          candidateOpen ? 'underline font-black' : 'font-light'
        }`}
        onClick={handleCandToggle}
      >
        <div className="flex items-center">
          Candidate Resources{' '}
          <FiChevronDown
            className={`ml-1 transition-all ${candidateOpen && 'rotate-180'}`}
          />
        </div>
        <Backdrop
          open={candidateOpen}
          className="opacity-0"
          style={{ opacity: 0 }}
          onClick={() => {
            () => setCandidateOpen(false);
          }}
        ></Backdrop>
        {candidateOpen && (
          <div
            className={`absolute z-50 top-14 right-0  bg-white rounded-lg  shadow-md transition  ${
              candidateOpen
                ? 'px-1 p-2 overflow-hidden'
                : 'p-0 opacity-0 overflow-visible'
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
    </>
  );
}
