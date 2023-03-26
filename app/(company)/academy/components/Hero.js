import YellowButton from '@shared/buttons/YellowButton';
import LandingPageHero from '@shared/landing-pages/LangdinPageHero';
import Image from 'next/image';
import Link from 'next/link';

import teamImg from '/public/images/landing-pages/academy.png';

export default function Hero() {
  return (
    <LandingPageHero wideBg>
      <div className="grid grid-cols-12 gap-4">
        <div className=" col-span-12 lg:col-span-6 pb-32">
          <h1 className=" text-6xl lg:text-8xl font-black">
            Good Party
            <br />
            Academy
          </h1>
          <h2 className="mt-5 text-xl mb-12">
            Our free, comprehensive, no-BS masterclass to prepare you to run a
            winning campaign.
          </h2>
          <Link href="/run-for-office" id="academy-hero-get-started">
            <YellowButton>GET STARTED</YellowButton>
          </Link>
        </div>
        <div className="col-span-12 lg:col-span-6 relative min-h-[300px] md:min-h-[500px]">
          <Image
            src={teamImg}
            alt="GP team"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </LandingPageHero>
  );
}
