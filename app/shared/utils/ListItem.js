'use client';

import H4 from '@shared/typography/H4';
import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

export default function ListItem({
  variant = 'list',
  title,
  number,
  children,
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {variant === 'list' && (
          <div className="mr-5 h-6 w-6 bg-primary text-slate-50 flex items-center justify-center rounded-full font-semibold">
            {number}
          </div>
        )}
        <H4>{title}</H4>
        <FaChevronRight
          className={`ml-4 transition-all duration-300 ${open && '-rotate-90'}`}
        />
      </div>
      {open && (
        <div className="ml-7 mt-4 bg-slate-400 rounded-xl p-4 lg:py-5 lg:px-6">
          {children}
        </div>
      )}
    </div>
  );
}
