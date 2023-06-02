import Pill from '@shared/buttons/Pill';
import MaxWidth from '@shared/layouts/MaxWidth';
import TogglePanel from '@shared/utils/TogglePanel';
import Image from 'next/image';
import { LuStars } from 'react-icons/lu';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiTeamLine, RiLineChartLine } from 'react-icons/ri';

const features = [
  {
    name: 'Experts',
    title: 'Get help from experts',
    description:
      'We cut out expensive consultants by providing you free access to our team of experienced political professionals in fundraising, digital, field operations, and more.',
  },
  {
    name: 'Tools',
    title: 'Get access to cutting-edge AI tools',
    description:
      'Our AI-powered tools make campaigning smarter, faster and cheaper than ever. This will give you a competitive edge over old-style, two-party politicians.',
  },
  {
    name: 'Track',
    title: 'Track your progress',
    description:
      'Keep your campaign on track by logging the most important activities of your campaign. Your free tracker shows you everything you need to do to get a win.',
  },
];

export default function Features({ demoCallback }) {
  return (
    <section className="my-24">
      <MaxWidth>
        <div className="flex justify-center items-center">
          <div className="flex flex-col md:flex-row items-center justify-between p-5 w-3/4">
            <div className="flex flex-col flex-auto items-center text-center">
              <h2 className="font-black text-8xl">100+</h2>
              <div className="text-lg mt-3">Candidates supported</div>
            </div>
            <div className="flex flex-col flex-auto items-center text-center mt-10 md:mt-0">
              <h2 className="font-black text-8xl">50+</h2>
              <div className="text-lg mt-3">Yeas of Experience</div>
            </div>

            <div className="flex flex-col flex-auto items-center text-center mt-10 md:mt-0">
              <h2 className="font-black text-8xl">$0</h2>
              <div className="text-lg mt-3">Cost to you</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center mt-10 md:mt-20">
          <div className="flex flex-col justify-center flex-auto md:w-1/3">
            {features.map((step, index) => (
              <div key={step.name}>
                <TogglePanel
                  label={features[index].title}
                  icon={
                    features[index].name === 'Experts' ? (
                      <div className="flex items-center justify-center rounded-full p-2 bg-gradient-to-br from-[#4F15F4] to-[#13A9EA] opacity-50">
                        <RiTeamLine />
                      </div>
                    ) : features[index].name === 'Tools' ? (
                      <div className="flex items-center justify-center rounded-full p-2 bg-gradient-to-br from-[#F48015] to-[#5DF415] opacity-50">
                        <LuStars />
                      </div>
                    ) : features[index].name === 'Track' ? (
                      <div className="flex items-center justify-center rounded-full p-2 bg-gradient-to-br from-[#FF3AEB] to-[#3AF3FF] opacity-50">
                        <RiLineChartLine />
                      </div>
                    ) : (
                      <></>
                    )
                  }
                  children={features[index].description}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center text-center h-[500px] w-full md:w-2/3 mt-10 relative">
            <Image
              src="/images/run-page/platform.png"
              fill
              className="object-contain"
              alt=""
            />
          </div>
        </div>
        <div className="flex items-center flex-col w-full">
          <h3 className=" font-black text-4xl mt-10 mb-12">
            Any questions? Schedule a demo with our team
          </h3>
          <div>
            <div onClick={demoCallback} id="experts-demo-btn">
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
