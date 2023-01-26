import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import EmailForm from '../../../shared/inputs/EmailForm';

import bgImg from '/public/images/landing-pages/hero-bg.png';
import peopleImg from '/public/images/landing-pages/people.png';
import { FiInfo } from 'react-icons/fi';
import { AiTwotoneTool } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';

const points = [
  { text: 'On-demand, expert advice', icon: <FiInfo /> },
  { text: 'Free, automated tools', icon: <AiTwotoneTool /> },
  { text: 'Campaign management', icon: <FaUserAlt /> },
];

export default function Hero() {
  return (
    <section className="relative pt-5 lg:pt-20 pb-40">
      <div className="absolute h-full w-full lg:w-[50%] left-0 lg:left-[50%] top-0">
        <Image
          src={bgImg}
          sizes="100vw"
          fill
          className="object-cover"
          alt=""
          placeholder="blur"
          priority
        />
      </div>
      <MaxWidth>
        <div className="relative z-10">
          <div className="grid grid-cols-12 gap2">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="text-6xl leading-tight font-black">
                Empowering people to change politics for good.
              </h1>
              <h2 className="text-xl font-bold mt-5 lg:w-[70%]">
                We help independent-minded people who want to get things done
                run for office. Chat with an expert to learn how.
              </h2>
              <EmailForm
                formId="46116311-525b-42a2-b88e-d2ab86f26b8a"
                pageName="run for office"
              />
            </div>
            <div className="col-span-12 lg:col-span-4 flex justify-center flex-col">
              {points.map((point) => (
                <div
                  key={point.text}
                  className="bg-darkPurple mb-1 text-white font-bold rounded-xl flex justify-between items-center px-6 py-5"
                >
                  <div className="text-xl">{point.text}</div>
                  <div className="text-2xl">{point.icon}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MaxWidth>
      <div
        className="hidden lg:block absolute bottom-0 left-[50%]"
        style={{ marginLeft: '-200px' }}
      >
        <Image
          src={peopleImg}
          alt=""
          placeholder="blur"
          priority
          width={400}
          height={250}
        />
      </div>
    </section>
  );
}
