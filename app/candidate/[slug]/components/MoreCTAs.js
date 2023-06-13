'use client';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { useState } from 'react';

import { AiOutlineCaretDown } from 'react-icons/ai';
import { RiProfileLine, RiShareForwardLine } from 'react-icons/ri';
import ShareButton from './ShareButton';

export default function MoreCTAs(props) {
  const [open, setOpen] = useState(false);
  const { candidate } = props;
  const { website } = candidate;
  return (
    <div className="relative">
      <div
        onClick={() => {
          setOpen(!open);
        }}
      >
        <SecondaryButton size="medium">
          <div className="py-[6px]">
            <AiOutlineCaretDown />
          </div>
        </SecondaryButton>
      </div>
      {open && (
        <div className="absolute right-0 top-16 bg-primary text-gray-800 p-5 rounded-lg min-w-[270px] shadow-lg z-20">
          <ShareButton>
            <div className="flex items-center cursor-pointer py-3">
              <RiShareForwardLine />
              <div className="ml-2">Share</div>
            </div>
          </ShareButton>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-1 block no-underline"
            >
              <div className="flex items-center cursor-pointer  py-3">
                <RiProfileLine />
                <div className="ml-2">Candidate website</div>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
