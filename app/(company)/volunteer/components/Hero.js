import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import EmailForm from '../../../shared/inputs/EmailForm';

import bgImg from '/public/images/landing-pages/hero-bg.png';

export default function Hero() {
  return (
    <section className="relative pt-5 lg:pt-20 lg:pb-40">
      <div className="absolute h-full w-full lg:w-[50%] left-0 lg:left-[50%] top-0">
        <Image
          src={bgImg}
          sizes="100vw"
          fill
          className="object-cover object-left"
          alt=""
          placeholder="blur"
          priority
        />
      </div>
      <MaxWidth>
        <div className="relative z-10 lg:w-[60%]">
          <h1 className="text-6xl leading-tight font-black">
            Join the movement to end the two-party system
          </h1>
          <h2 className="text-xl mt-5 lg:w-[80%]">
            We're organizing a community of Good Partiers to realize our
            collective power to elect promising independents around the country
            and fix our broken system.
          </h2>
          <EmailForm
            formId="c7d78873-1ed0-4202-ab01-76577e57352c"
            pageName="volunteer"
            label="Join Us"
          />
        </div>
        <div></div>
      </MaxWidth>
    </section>
  );
}
