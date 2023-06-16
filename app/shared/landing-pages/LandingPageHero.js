import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';

import bgImg from '/public/images/homepage/art.png';

export default function LandingPageHero({ children, wideBg, ...props }) {
  return (
    <section className="relative pt-5 lg:pt-20" {...props}>
      <div
        className={`absolute h-full w-full max-h[200px] top-0 ${
          wideBg
            ? 'lg:w-[60%] lg:left-[40%]'
            : 'left-[-50%] lg:w-[50%] lg:left-[50%]'
        }`}
      >
        <Image
          src={bgImg}
          sizes="100vw"
          fill
          className={
            wideBg
              ? 'object-contain object-right-top'
              : 'object-contain object-right-top lg:object-cover lg:object-left-top'
          }
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
