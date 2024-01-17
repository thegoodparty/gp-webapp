'use client';

import { MdLocalPrintshop } from 'react-icons/md';

export default function Print({ printCallback }) {
  return (
    <div className="px-4 cursor-pointer" onClick={printCallback}>
      <MdLocalPrintshop size={30} />
    </div>
  );
}
