import Image from 'next/image';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Carousel from '@shared/inputs/Carousel';

const sections = [
  {
    title: 'Candidate for Maine House District 104',
    name: 'Anne G.',
    description:
      '“As an Indie candidate without a part organization it meant a lot to me to have someone working hard to help me reach voters.”',
    img: '/images/run-for-office/anne.jpg',
  },
  {
    name: 'Breanna S.',
    title: 'Fintech Founder',
    description:
      '“Working with the different AI tools was an amazing experience because… I was able to see what it would be like to enter my message from my own vocabulary, my own heart and mind and have AI just slightly tweak it in order to be the best version for the type of audience Im trying to engage with.”',
    img: '/images/run-for-office/breanna.jpg',
  },
  {
    name: 'Carlos R.',
    title: 'Regulatory Writer',
    description:
      '“[Good Party shows that] there are tools out there for people who are not connected to any political parties, who dont have any money behind them.”',
    img: '/images/run-for-office/carlos.jpg',
  },
  // {
  //   name: 'Chaz M.',
  //   title: 'Firefighter',
  //   description:
  //     '“[Good Party shows that] there are tools out there for people who are not connected to any political parties, who dont have any money behind them.”',
  //   img: chazImg,
  // },
  // {
  //   name: 'Ben W.',
  //   title: 'Candidate for Maine House District 89',
  //   description:
  //     '“Being an independent means that it can be hard to run with no party to back you, but Good Party changed that. The staff at good party was friendly, inviting, and highly knowledgeable.”',
  //   img: benImg,
  // },
];

export default function ToolsSection() {
  return (
    <section className="bg-indigo-800 pb-20">
      <div className="grid grid-cols-12 gap-3 relative items-center pb-14 lg:pb-0 -pt-[50px] z-50 overlay">
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-end lg:pr-10">
          <div className="w-auto ml-0 flex relative">
            <Image
              src="/images/homepage/dots.svg"
              sizes="100vw"
              height={100}
              width={100}
              className="object-contain"
              alt=""
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
          <div className="w-auto ml-0 flex relative">
            <Image
              src="/images/homepage/software.png"
              sizes="100vw"
              height={300}
              width={440}
              className="object-contain"
              alt=""
            />
          </div>
        </div>
        <div className="col-span-12 mt-20 justify-self-center">
          <Carousel sections={sections} />
        </div>
      </div>
    </section>
  );
}
