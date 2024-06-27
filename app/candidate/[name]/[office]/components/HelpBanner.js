import PrimaryButton from '@shared/buttons/PrimaryButton';
import CTA from './CTA';

export default function HelpBanner({ candidate }) {
  const { firstName, office, city, state } = candidate;
  return (
    <div className="flex justify-between py-2 px-6 items-center bg-primary-dark">
      <div>
        Help Will <span className="text-secondary">{firstName}</span> win for{' '}
        <span className="text-secondary">
          {office} {city || ''}, {state}
        </span>
      </div>
      <div>
        <CTA id="hero-learn-more">
          <PrimaryButton>Learn More</PrimaryButton>
        </CTA>
      </div>
    </div>
  );
}
