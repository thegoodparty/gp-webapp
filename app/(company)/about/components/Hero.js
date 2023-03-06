import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import EmailForm from '../../../shared/inputs/EmailForm';

import bgImg from '/public/images/landing-pages/hero-bg.png';
import peopleImg from '/public/images/landing-pages/people.png';
import { FiInfo } from 'react-icons/fi';
import { AiTwotoneTool } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import LandingPageHero from '@shared/landing-pages/LangdinPageHero';

const points = [
  { text: 'On-demand, expert advice', icon: <FiInfo /> },
  { text: 'Free, automated tools', icon: <AiTwotoneTool /> },
  { text: 'Campaign management', icon: <FaUserAlt /> },
];

export default function Hero() {
  return (
    <LandingPageHero>
      <div className="relative pb-12">
        <h1 className="text-6xl leading-tight font-black">About Good Party</h1>
        <h2 className="text-2xl leading-relaxed  mt-5 lg:w-[40%]">
          Good Party is <strong>not a political party.</strong> We&apos;re
          building tools to change the rules and a movement of people to disrupt
          the corrupt!
        </h2>
        <h3 className="mt-14 font-bold text-2xl py-10 border-b lg:border-y border-neutral-300">
          <div className=" lg:w-[80%]">
            We&apos;re building a movement and free tech to end America&apos;s
            two-party political dysfunction and create a truly representative
            democracy. Discover candidates, volunteer, or run for office to join
            the movement.
          </div>
        </h3>
      </div>
    </LandingPageHero>
  );
}
