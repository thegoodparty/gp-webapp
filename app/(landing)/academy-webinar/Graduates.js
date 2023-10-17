import MaxWidth from '@shared/layouts/MaxWidth';
import MarketingH2 from '@shared/typography/MarketingH2';
import Image from 'next/image';

import VictoriaImg from 'public/images/landing-pages/victoria.png';
import BreannaImg from 'public/images/landing-pages/breanna.png';
import CarlosImg from 'public/images/landing-pages/carlos.png';
import Body1 from '@shared/typography/Body1';
import { BiSolidQuoteAltRight } from 'react-icons/bi';

const graduates = [
  {
    name: 'Victoria - School Teacher, NC',
    img: VictoriaImg,
    desc: 'Either we can complain about it, or we can do something about it.’ Toward the beginning of this year, I decided to get off the sidelines and make a decision to run for office.',
  },
  {
    name: 'Breanna - Startup Founder, TN',
    img: BreannaImg,
    desc: "Good Party Academy is a good place to go if you've been thinking about running for office, you're curious about it, or if you want to be supportive of those that will run outside the two-party system. It's a great place to start and win.",
  },
  {
    name: 'Carlos - Regulatory Writer, TN',
    img: CarlosImg,
    desc: 'As you go through life and get older and realize the people in charge are not doing a great job… then you start to question, Okay well, why not me then?',
  },
];

export default function Graduates() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <section className="mt-48 px-4 py-10 md:p-20 md:rounded-xl relative shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="relative z-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <MarketingH2 className="md:text-right mb-10 md:pr-20">
                See what our graduates are saying
              </MarketingH2>
              <Image
                src="/images/landing-pages/arrow.svg"
                height={503}
                width={524}
                alt="graph"
                className="-ml-20 hidden md:block"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="relative md:-mt-40">
                {graduates.map((graduate) => (
                  <div
                    key={graduate.name}
                    className="px-5 pt-5 pb-16 relative shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white rounded-xl mb-7 grid grid-cols-12 gap-4"
                  >
                    <div className=" col-span-3 relative">
                      <Image
                        src={graduate.img}
                        fill
                        alt={graduate.name}
                        className=" object-contain object-top"
                      />
                    </div>
                    <div className=" col-span-9">
                      <Body1>{graduate.desc}</Body1>
                      <div className="mt-3 font-bold text-purple-400">
                        {graduate.name}
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-purple-400 text-6xl">
                      <BiSolidQuoteAltRight />
                    </div>
                  </div>
                ))}

                <Image
                  src="/images/landing-pages/arrow.svg"
                  height={503}
                  width={524}
                  alt="graph"
                  className="-ml-20 md:hidden"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute w-full left-0 h-full top-0">
          <Image
            src="/images/landing-pages/spot-bg.svg"
            fill
            alt="bg"
            className="object-cover md:object-contain object-right-top"
          />
        </div>
      </section>
    </div>
  );
}
