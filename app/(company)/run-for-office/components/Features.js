import Pill from '@shared/buttons/Pill';
import MaxWidth from '@shared/layouts/MaxWidth';
import TogglePanel from '@shared/utils/TogglePanel';
import Image from 'next/image';
import { LuStars } from 'react-icons/lu';
import { RiTeamLine, RiLineChartLine } from 'react-icons/ri';

const features = [
  {
    name: 'Experts',
    title: 'Get help from experts',
    description:
      'We cut out expensive consultants by providing you free access to our team of experienced political professionals in fundraising, digital, field operations, and more.',
    icon: <RiTeamLine />,
    bgfrom: 'from-[#4F15F4]',
    bgto: 'to-[#13A9EA]',
  },
  {
    name: 'Tools',
    title: 'Get access to cutting-edge AI tools',
    description:
      'Our AI-powered tools make campaigning smarter, faster and cheaper than ever. This will give you a competitive edge over old-style, two-party politicians.',
    icon: <RiLineChartLine />,
    bgfrom: 'from-[#F48015]',
    bgto: 'to-[#5DF415]',
  },
  {
    name: 'Track',
    title: 'Track your progress',
    description:
      'Keep your campaign on track by logging the most important activities of your campaign. Your free tracker shows you everything you need to do to get a win.',
    icon: <LuStars />,
    bgfrom: 'from-[#FF3AEB]',
    bgto: 'to-[#3AF3FF]',
  },
];

export default function Features({ demoCallback }) {
  return (
    <section className="my-24">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 items-stretch text-center">
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-black text-8xl">100+</h2>
            <div className="text-lg mt-3">Candidates supported</div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-black text-8xl">50+</h2>
            <div className="text-lg mt-3">Years of Experience</div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-black text-8xl">$0</h2>
            <div className="text-lg mt-3">Cost to you</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 justify-center items-center mt-10 md:mt-20">
          <div className="col-span-12 md:col-span-4 justify-center">
            {features.map((feature, index) => (
              <div key={feature.name}>
                <TogglePanel
                  label={feature.title}
                  icon={
                    <div
                      className={`flex items-center justify-center rounded-full p-2 bg-gradient-to-br ${feature.bgfrom} ${feature.bgto} opacity-50`}
                    >
                      {feature.icon}
                    </div>
                  }
                  children={feature.description}
                />
              </div>
            ))}
          </div>
          <div className="col-span-12 md:col-span-8 justify-center items-center text-center h-[500px] w-full mt-10 relative">
            <Image
              src="/images/run-for-office/platform.png"
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
