import Image from 'next/image';
import { FiInfo } from 'react-icons/fi';
import { AiTwotoneTool } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import MaxWidth from '@shared/layouts/MaxWidth';
import EmailFormV2 from '@shared/inputs/EmailFormV2';


const points = [
  { text: 'On-demand, expert advice', icon: <FiInfo /> },
  { text: 'Free, automated tools', icon: <AiTwotoneTool /> },
  { text: 'Campaign management', icon: <FaUserAlt /> },
];

const Hero = () => <section className="relative
  p-4
  md:p-8
  xl:px-0
  xl:py-24
  xl:mx-auto
  bg-primary-dark">
    <div className="max-w-screen-xl mx-auto">
      <div className="text-white
        font-medium
        xl:grid
        xl:grid-cols-12">
        <div className="mb-8 md:mb-16 xl:mb-0 xl:col-start-1 xl:col-span-6">
          <Image
            src="/images/logo-hologram-white.svg"
            width={81}
            height={66.12}
            alt="GoodParty Logo" />
          <h1 className="text-5xl md:text-8xl leading-tight my-8">The Good Party
            Mission</h1>
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
        <div className="xl:col-start-8 xl:col-span-5">
          <Image
            className="w-full hidden md:block"
            width={832}
            height={681}
            src="/images/landing-pages/about-hero.png" alt="about-hero" />
          <Image
            className="w-full md:hidden"
            width={288}
            height={252}
            src="/images/landing-pages/about-hero-sm.png" alt="about-hero" />
        </div>
      </div>
    </div>
</section>

export default Hero;
