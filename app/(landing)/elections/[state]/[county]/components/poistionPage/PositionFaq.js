'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

export default function PositionFaq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1 text-white">
      <div
        className="py-5 px-6 bg-[#2A2E33] cursor-pointer flex justify-between items-center"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div>{q}</div>
        <FaPlus className={`transition ${open ? ' rotate-45' : ''}`} />
      </div>
      <div
        className={` px-6 bg-[#2A2E33] border-t border-primary transition-all ${
          open ? 'h-auto py-5' : ' h-0 overflow-hidden'
        }`}
      >
        {a}
      </div>
    </div>
  );
}
