import LandingPageHero from '@shared/landing-pages/LangdinPageHero';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import EmailForm from '../../../shared/inputs/EmailForm';

import bgImg from '/public/images/landing-pages/hero-bg.png';

export default function Hero() {
  return (
    <LandingPageHero>
      <div className="relative lg:pb-12">
        <div className="lg:w-[70%]">
          <h1 className="text-6xl leading-tight font-black">
            Join the movement to end the two-party system
          </h1>
          <h2 className="text-xl mt-5 lg:w-[80%]">
            We&apos;re organizing a community of Good Partiers to realize our
            collective power to elect promising independents around the country
            and fix our broken system.
          </h2>
          <EmailForm
            formId="c7d78873-1ed0-4202-ab01-76577e57352c"
            pageName="volunteer"
            label="Join an info session"
            labelId="volunteer-form"
          />
        </div>
      </div>
    </LandingPageHero>
  );
}
