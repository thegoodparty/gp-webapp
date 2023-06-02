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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur nulla ac nunc dapibus, ut sagittis eros congue. Integer venenatis tempus faucibus. Fusce gravida ipsum a nisl gravida, et bibendum justo ornare. Sed nec nisl eget metus bibendum bibendum. Quisque mattis turpis vel turpis feugiat, vel dictum sapien suscipit. Nullam at mauris a elit tristique dictum. Sed non magna quis velit luctus eleifend vel ut nibh. Ut a tristique ex.',
  },
  {
    name: 'Tools',
    title: 'Get access to cutting-edge AI tools',
    description:
      'Sed eu velit eu justo placerat convallis. Fusce ac enim eu sem ultricies varius in non tortor. Nullam vitae arcu ac enim aliquet dapibus. Aliquam lectus ex, venenatis at neque quis, lobortis pharetra elit. Integer vitae nulla finibus, elementum quam lobortis, suscipit ipsum. Sed volutpat varius risus, sed consectetur magna. Curabitur quis augue posuere, dignissim sapien in, iaculis eros.',
  },
  {
    name: 'Track',
    title: 'Track your progress',
    description:
      'Mauris nec magna blandit, auctor purus id, interdum dui. Quisque euismod dapibus arcu, vel suscipit quam consequat vel. Sed suscipit felis ut felis cursus dignissim. Donec euismod dui in dui venenatis, id sagittis turpis gravida. Curabitur ut leo non sapien eleifend eleifend. Aliquam mattis lectus justo, vitae molestie ex placerat ac. Sed gravida euismod eleifend. Sed id sapien nulla.',
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
                      <div className="flex items-center justify-center rounded-full p-2 bg-gradient-to-br from-[#AFA8FF] to-[#FFD78A]">
                        <RiTeamLine />
                      </div>
                    ) : features[index].name === 'Tools' ? (
                      <div className="flex items-center justify-center rounded-full p-2 bg-gradient-to-br from-[#F9FFB1] to-[#FFD27A]">
                        <LuStars />
                      </div>
                    ) : features[index].name === 'Track' ? (
                      <div className="flex items-center justify-center rounded-full p-2 bg-gradient-to-br from-[#C5F4FF] to-[#FFD481]">
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
