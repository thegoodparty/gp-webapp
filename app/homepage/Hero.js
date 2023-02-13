import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import EmailForm from '@shared/inputs/EmailForm';

import bgImg from '/public/images/landing-pages/hero-bg.png';
import votersImg from '/public/images/homepage-jan23/homepage-voters.png';
import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';
import ForVoters from './ForVoters';
import LandingPageHero from '@shared/landing-pages/LangdinPageHero';

export default function Hero() {
  return (
    <LandingPageHero wideBg>
      <div className=" lg:w-[60%]">
        <h1 className="text-6xl leading-tight font-black">
          Change politics for good
        </h1>
        <h2 className="text-xl font-bold mt-5">
          We're building a movement and free tech to end America's two-party
          political dysfunction and create a truly representative democracy.
          Discover candidates, volunteer, or run for office to join the
          movement.
        </h2>
        <EmailForm
          formId="5d84452a-01df-422b-9734-580148677d2c"
          pageName="Home Page"
        />
      </div>
      <ForVoters />
    </LandingPageHero>
  );
}
