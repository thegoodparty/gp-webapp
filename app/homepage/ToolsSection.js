import Image from 'next/image';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Carousel from '@shared/inputs/Carousel';
import MaxWidth from '@shared/layouts/MaxWidth';
import softwareImg from '/public/images/homepage/software.png';

const sections = [
  {
    name: 'Peter H. - Independent',
    title: 'GPA Candidate',
    subtitle: 'Good Party Academy Graduate',
    description:
      "My takeaway was “I could probably shake that many hands!” it's within reach, I could represent my community, my neighborhood. It's not a moonshot.",
    img: '/images/homepage/peter.jpg',
  },
  {
    name: 'Chaz M. - Independent',
    title: 'Firefighter',
    subtitle: 'Good Party Academy Graduate',
    description:
      "With where Good Party's AI is today, you could [run for office] today… my aha moment was how powerful the software is. And it's free!",
    img: '/images/homepage/chaz.jpg',
  },
  {
    title: 'Former candidate for Maine House ',
    name: 'Anne G. - Independent',
    subtitle: 'Good Party Certified',
    description:
      'As an Indie candidate without a party organization it meant a lot to me to have someone working hard to help me reach younger voters.',
    img: '/images/homepage/anne.jpg',
  },
];

export default function ToolsSection() {
  return (
    <section className="bg-indigo-800 pb-20">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 relative pb-14 lg:pb-0 -pt-[50px] items-stretch">
          <div className="col-span-12 lg:col-span-6 justify-self-center lg:justify-self-end lg:pr-10 mt-10 p-10 lg:-mt-[75px]">
            <div className="w-auto ml-0 flex relative md:-mt-20">
              <Image
                src="/images/homepage/dots.svg"
                sizes="100vw"
                height={151}
                width={151}
                className="object-contain"
                alt="dots"
              />
            </div>

            <div className="font-sfpro text-slate-50 font-semibold text-[56px] leading-[64px] mt-2">
              Free tools + experts power winning campaigns
            </div>

            <div className="font-sfpro text-slate-50 text-[18px] leading-6 mt-2">
              Independent candidates get free access to our team with 50+ years
              of campaign experience and our latest AI tools that keep your
              campaign on track
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="mt-4">
                <Link href="/run-for-office">
                  <WarningButton size="medium">
                    Free campaign tools
                  </WarningButton>
                </Link>
              </div>
              <div className="mt-4 pl-0 md:pl-3">
                <Link href="/run-for-office">
                  <SecondaryButton size="medium">
                    Learn how to run
                  </SecondaryButton>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 justify-self-center lg:justify-self-start lg:pl-10 mt-8 md:mt-40 lg:mt-0">
            <div className="ml-0 flex relative overlay z-50 mt-10 md:-mt-40 lg:-mt-[125px] h-auto w-full">
              <Image
                src={softwareImg}
                sizes="100vw"
                className="object-contain"
                alt=""
              />
            </div>
            <div className="absolute justify-end mr-3 overlay z-50">
              <Image
                src="/images/homepage/track.svg"
                width="90"
                height="90"
                className="ml-12"
                alt="track"
              />
            </div>
          </div>
          <div className="col-span-12 mt-20 justify-self-center">
            <Carousel sections={sections} />

            <div className="absolute justify-end mt-20 mr-3 overlay z-50">
              <Image
                src="/images/homepage/hex.svg"
                width="90"
                height="90"
                className="ml-12"
                alt="Good Party"
              />
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
