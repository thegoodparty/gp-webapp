import PrimaryButton from '@shared/buttons/PrimaryButton';
import CTA from './CTA';
import Image from 'next/image';
import InfoButton from '@shared/buttons/InfoButton';

export default function HelpBanner({ candidate }) {
  const { firstName, lastName, office, city, state } = candidate;
  return (
    <div className="flex justify-between py-4 px-6 items-center bg-primary-dark">
      <div className="flex items-center">
        <Image
          src="/images/logo-hologram-white.svg"
          alt="GoodParty"
          width={28}
          height={28}
          priority
        />
        <div className="ml-2">
          Are you {firstName} {lastName}? Get data for {office} {city || ''},{' '}
          {state}
        </div>
      </div>
      <div>
        <CTA id="hero-learn-more">
          <InfoButton>Get Data</InfoButton>
        </CTA>
      </div>
    </div>
  );
}
