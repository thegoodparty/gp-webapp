import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'

import bgImg from 'public/images/landing-pages/hero-bg.png'

export default function LandingPageHero({ children, wideBg, ...props }) {
  return (
    <section className="relative pt-5 lg:pt-20" {...props}>
      <div className="absolute h-full w-full max-h[200px] top-0 lg:w-[60%] lg:left-[40%]">
        <Image
          src={bgImg}
          sizes="100vw"
          fill
          className="object-contain object-right-top"
          alt=""
          priority
          quality={40}
        />
      </div>
      <MaxWidth>
        <div className="relative z-10">{children}</div>
      </MaxWidth>
    </section>
  )
}
