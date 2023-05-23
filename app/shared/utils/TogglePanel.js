'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import H4 from '@shared/typography/H4';
import Image from 'next/image';
import { useState } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

export default function TogglePanel({
  icon,
  label = '',
  forceExpand,
  // badge,
  children,
}) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };

  /*
        <div
          className={`overflow-hidden transition-all duration-300  ${
            expand ? 'max-h-[3000px]' : 'max-h-0 '
          }`}
        >
  */
  return (
    <>
      <div
        className={`bg-slate-200 py-5 px-7 flex items-center justify-between cursor-pointer mt-2 ${
          open ? 'rounded-t-xl' : 'rounded-xl'
        }`}
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          {icon && (
            <>
              {typeof icon === 'string' ? (
                <Image
                  src={icon}
                  width={36}
                  height={36}
                  alt=""
                  className="mr-4"
                />
              ) : (
                <div className="mr-4">{icon}</div>
              )}
            </>
          )}
          <H4>{label}</H4>
        </div>
        <div className="flex items-center">
          {/* {badge && <div>badge</div>} */}
          {open ? (
            <PrimaryButton size="medium">
              <FiChevronUp />
            </PrimaryButton>
          ) : (
            <SecondaryButton size="medium">
              <FiChevronDown />
            </SecondaryButton>
          )}
        </div>
      </div>
      {(forceExpand || open) && (
        <div className="bg-slate-200 pt-4 pb-7 px-7 rounded-b-xl">
          {children}
        </div>
      )}
    </>
  );
}
