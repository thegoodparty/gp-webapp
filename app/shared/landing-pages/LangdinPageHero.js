import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import EmailForm from '@shared/inputs/EmailForm';

import bgImg from '/public/images/landing-pages/hero-bg.png';

export default function LandingPageHero({ children, wideBg, ...props }) {
  return (
    <section className="relative pt-5 lg:pt-20" {...props}>
      <div
        className={`absolute h-full w-full top-0 ${
          wideBg
            ? ' w-[200%] lg:w-[60%] left-[-50%] lg:left-[40%]'
            : 'lg:w-[50%] left-0 lg:left-[50%]'
        }`}
      >
        <Image
          src={bgImg}
          sizes="100vw"
          fill
          className="object-cover object-left-top"
          alt=""
          placeholder="blur"
          priority
        />
      </div>
      <MaxWidth>
        <div className="relative z-10">{children}</div>
      </MaxWidth>
    </section>
  );
}
