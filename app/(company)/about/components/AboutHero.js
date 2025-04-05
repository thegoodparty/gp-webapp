import Image from 'next/image'
import EmailFormV2 from '@shared/inputs/EmailFormV2'
import MaxWidth from '@shared/layouts/MaxWidth'

const AboutHero = () => (
  <section
    className="relative
  p-4
  md:p-8
  xl:px-0
  xl:py-24
  xl:mx-auto
  bg-primary-dark"
  >
    <MaxWidth>
      <div
        className="text-white
        font-medium
        grid
        grid-cols-12"
      >
        <div className="col-span-12 mb-8 md:mb-16 xl:mb-0 xl:col-span-6">
          <Image
            src="/images/logo/heart.svg"
            width={81}
            height={66.12}
            alt="GoodParty Logo"
            priority
          />
          <h1 className="text-5xl md:text-8xl leading-tight my-8">
            The GoodParty.org Mission
          </h1>
          <h2 className="text-2xl md:text-4xl leading-tight mb-8 md:mb-16">
            The movement and tools to disrupt the corrupt two-party system
          </h2>
          <EmailFormV2
            formId="5d84452a-01df-422b-9734-580148677d2c"
            pageName="Home Page"
            labelId="subscribe-form"
            label="Join the movement"
          />
        </div>
        <div className="col-span-12 xl:col-start-8 xl:col-span-5 flex justify-center">
          <Image
            className="w-full hidden md:block object-contain"
            width={832}
            height={681}
            src="/images/landing-pages/about-hero.png"
            alt="about-hero"
            priority
          />
          <Image
            className="w-full md:hidden"
            width={288}
            height={252}
            src="/images/landing-pages/about-hero-sm.png"
            alt="about-hero"
            priority
          />
        </div>
      </div>
    </MaxWidth>
  </section>
)

export default AboutHero
