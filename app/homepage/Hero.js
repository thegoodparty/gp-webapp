import EmailForm from '@shared/inputs/EmailForm';
import ForVoters from './ForVoters';
import LandingPageHero from '@shared/landing-pages/LandingPageHero';
import Image from 'next/image';
import bgImg from '/public/images/homepage/art.png';

export default function Hero() {
  return (
    <>
      <div className="grid grid-cols-12 gap-3 md:justify-items-center mt-3">
        <div className="col-span-12 lg:col-span-7 lg:pl-20 max-w-2xl p-10">
          <div className="absolute -mt-10 mr-3">
            <Image
              src="/images/homepage/squiggles.svg"
              width="90"
              height="90"
              className="ml-12"
              alt="Good Party"
            />
          </div>
          <h1 className="text-6xl leading-tight font-black">
            <p>Shape our</p>
            <p>country&apos;s</p>
            <p>destiny</p>
          </h1>
          <h2 className="text-lg mt-5">
            We&apos;re not a political party – we&apos;re building a movement
            and free tech to end America&apos;s two-party political dysfunction
          </h2>
          <h3 className="text-lg mt-5">
            Discover independent candidates, volunteer, or run for office to
            join the movement
          </h3>
          <EmailForm
            formId="5d84452a-01df-422b-9734-580148677d2c"
            pageName="Home Page"
            labelId="subscribe-form"
          />
        </div>
        <div className="flex col-span-12 lg:col-span-5 relative h-[600px] lg:pt-10">
          <Image
            src={bgImg}
            sizes="50vw"
            className="object-contain object-right-top"
            alt=""
            placeholder="blur"
            priority
          />
        </div>
      </div>
    </>
  );
}
