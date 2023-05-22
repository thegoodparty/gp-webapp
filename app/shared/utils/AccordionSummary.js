'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Image from 'next/image';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

export default function AccordionSummary({
  open = false,
  toggleCallback = () => {},
  icon,
  label = '',
  // badge,
}) {
  return (
    <div
      className={`bg-slate-200 py-5 px-7 flex items-center justify-between cursor-pointer mt-2 ${
        open ? 'rounded-t-xl' : 'rounded-xl'
      }`}
      onClick={toggleCallback}
    >
      <div className="flex items-center">
        {icon && (
          <>
            {typeof icon === 'string' ? (
              <Image
                src={icon}
                width={22}
                height={28}
                alt=""
                className="mr-4"
              />
            ) : (
              <div className="mr-4">{icon}</div>
            )}
          </>
        )}
        <div>{label}</div>
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
  );
}
