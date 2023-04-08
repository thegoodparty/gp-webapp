'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useState } from 'react';
import supportImg from 'public/images/landing-pages/run-support.png';
import toolsImg from 'public/images/landing-pages/tools.png';
import expertsImg from 'public/images/landing-pages/experts.png';
import insightsImg from 'public/images/landing-pages/insights.png';
import { FaChevronCircleDown } from 'react-icons/fa';
import Image from 'next/image';
import Pill from '@shared/buttons/Pill';
import RunCampaignButton from './RunCampaignButton';

const sections = [
  {
    title: 'Support every step of the way',
    description:
      'Our campaign training and education software helps you learn how to explore a run, launch your campaign, and build support in a single interactive experience.',
    img: supportImg,
  },
  {
    title: 'Get help from experts',
    description:
      'We cut out expensive consultants by providing you free access to our team of experienced political professionals in fundraising, digital, field operations, and more.',
    img: expertsImg,
  },
  {
    title: 'Get access to cutting-edge AI tools',
    description:
      'Our AI-powered tools make campaigning smarter, faster and cheaper than ever and provide a  competitive edge over old-style, two-party politicians.',
    img: toolsImg,
  },
  {
    title: 'Actionable data, analysis and insights',
    description:
      'See where your voters are, and how to reach them.  Your free campaign tracker shows the path-to-victory and highlights the viability of your campaign.',
    img: insightsImg,
  },
];

export default function Accordion() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="py-28 bg-orange-400 bg-opacity-10">
      <MaxWidth>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-7 hidden lg:block">
            <div className="relative py-3 h-full w-[120%] h-[95%">
              <Image
                src={sections[selected].img}
                fill
                className="object-contain"
                alt=""
              />
              <div className="mt-2 flex justify-center absolute -bottom-10 left-0 w-full">
                {sections.map((section, index) => (
                  <div
                    key={section.title}
                    className={`w-4 h-4 rounded-full mx-2 bg-white border-2 border-white cursor-pointer ${
                      index === selected && 'bg-yellow-400'
                    }`}
                    onClick={() => setSelected(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 relative z-10">
            <div>
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className="px-10 py-8 bg-white mb-3 rounded-xl "
                  onClick={() => setSelected(index)}
                >
                  <div className="flex justify-between items-start cursor-pointer">
                    <div className="font-black text-xl">{section.title}</div>
                    <div
                      className={`transition-all duration-300 ${
                        index === selected && 'rotate-180'
                      }`}
                    >
                      <FaChevronCircleDown size={24} />
                    </div>
                  </div>

                  {index === selected && (
                    <div className="py-8">{section.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-28">
          <h2 className="text-center font-black text-4xl">
            Learn how to run a winning campaign
          </h2>
          <div className="grid grid-cols-12 gap-6 mt-10">
            <div className="col-span-12 lg:col-span-6 text-right">
              <RunCampaignButton />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Pill outlined className="w-48">
                <div className="tracking-wide">GET A DEMO</div>
              </Pill>
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
