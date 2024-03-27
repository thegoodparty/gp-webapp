'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H5 from '@shared/typography/H5';
import { useRouter } from 'next/navigation';
import { FaCar, FaChevronLeft } from 'react-icons/fa';

export default function TitleButtons(props) {
  const { voter } = props;

  const { address, city, state } = voter;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className=" col-span-8 ">
        <PrimaryButton fullWidth>
          <a href={`//maps.apple.com/?q=${address},${city},${state}`}>
            <div className="flex items-center justify-center">
              <FaCar />
              <div className="ml-2">Directions</div>
            </div>
          </a>
        </PrimaryButton>
      </div>
      <div className=" col-span-4 ">
        <PrimaryButton fullWidth variant="outlined">
          Skip
        </PrimaryButton>
      </div>
    </div>
  );
}
