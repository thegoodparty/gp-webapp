import Image from 'next/image';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Carousel from '@shared/inputs/Carousel';

const sections = [
  {
    name: 'Peter H.',
    title: 'GPA Candidate',
    description:
      "My takeaway was “I could probably shake that many hands!” it's within reach, I could represent my community, my neighborhood. It's not a moonshot.",
    img: '/images/homepage/peter.jpg',
  },
  {
    name: 'Chaz M.',
    title: 'Firefighter',
    description:
      "With where Good Party's AI is today, you could [run for office] today… my aha moment was how powerful the software is. And it's free!",
    img: '/images/homepage/chaz.jpg',
  },
  {
    title: 'Candidate for Maine House District 104',
    name: 'Anne G.',
    description:
      'As an Indie candidate without a party organization it meant a lot to me to have someone working hard to help me reach younger voters.',
    img: '/images/homepage/anne.jpg',
  },
];

export default function ToolsSection() {
  return (
    <section className="bg-indigo-800 pb-20">
      <div className="grid grid-cols-12 gap-3 relative items-center pb-14 lg:pb-0 -pt-[50px] z-50 overlay">
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-end lg:pr-10 mt-10">
          <div className="w-auto ml-0 flex relative md:-mt-20">
            <Image
              src="/images/homepage/dots.svg"
              sizes="100vw"
              height={100}
              width={100}
              className="object-contain"
              alt="dots"
            />
          </div>

          <div className="text-slate-50 font-black text-3xl mt-2 max-w-[300px]">
            Free tools + experts power winning campaigns
          </div>

          <div className="text-slate-50 text-md mt-2 max-w-[300px]">
            Independent candidates get free access to our team with 50+ years of
            campaign experience and our latest AI tools that keep your campaign
            on track
          </div>
          <div className="flex">
            <div className="mt-4">
              <Link href="/run-for-office">
                <WarningButton size="medium">Free campaign tools</WarningButton>
              </Link>
            </div>
            <div className="mt-4 pl-3">
              <Link href="/run-for-office">
                <SecondaryButton size="medium">
                  Learn how to run
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-start lg:pl-10 mt-10 lg:mt-0">
          <div className="w-auto ml-0 flex relative overlay z-50 mt-10 md:-mt-40 lg:-mt-60">
            <Image
              src="/images/homepage/software.png"
              sizes="100vw"
              height={300}
              width={440}
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
    </section>
  );
}
