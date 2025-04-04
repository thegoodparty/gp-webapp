import CTA from './CTA';
import Image from 'next/image';
import InfoButton from '@shared/buttons/InfoButton';
import Link from 'next/link';

export default function HelpBanner({ candidate }) {
  const { firstName, lastName, office, city, state } = candidate;
  return (
    <>
      <div className="fixed z-[1400] top-0 w-screen md:flex justify-between py-2 px-6 items-center bg-primary-dark">
        <div className="flex items-center justify-center md:justify-start">
          <Link href="/">
            <Image
              src="/images/logo/heart.svg"
              alt="GoodParty"
              width={28}
              height={28}
              priority
            />
          </Link>
          <div className="ml-2">
            Are you {firstName} {lastName}? Get data for{' '}
            {office ? `${office}, ` : ''} {city ? `${city}, ` : ''} {state}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <CTA id="hero-learn-more">
            <InfoButton fullWidth size="medium">
              Get Data
            </InfoButton>
          </CTA>
        </div>
      </div>
    </>
  );
}
