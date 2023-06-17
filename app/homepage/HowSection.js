import Image from 'next/image';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';

export default function HowSection() {
  return (
    <>
      <div className="absolute -mt-[125px] md:-mt-[175px] lg:-mt-[250px] mr-3">
        <Image
          src="/images/homepage/circles.svg"
          width="90"
          height="90"
          className="ml-12"
          alt="Good Party"
        />
      </div>
      <h3 className="text-4xl font-black text-center mb-20 mt-20">
        How Good Party works
      </h3>
      <div className="grid grid-cols-12 gap-3 relative items-center lg:pb-0 mb-5">
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-end lg:pr-10 mb-5">
          <div className="flex flex-row">
            <div className="flex flex-col text-xl mt-2 w-10 h-10 bg-lime-400 items-center justify-center rounded-lg -ml-14 mr-4">
              <span class="text-indigo-800 text-center">1</span>
            </div>

            <div className="text-2xl mt-2 text-start max-w-[300px]">
              Make independent candidates viable
            </div>
          </div>
          <div className="text-md mt-2 max-w-[300px]">
            Our free AI tools for campaigns, candidate recruitment, and team of
            experts are building up more competitive independent candidates
            across the country
          </div>
          <div className="mt-4">
            <Link href="/run-for-office">
              <SecondaryButton size="medium">Run for office</SecondaryButton>
            </Link>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-start lg:pl-10">
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
      </div>

      <div className="grid grid-cols-12 gap-3 relative items-center lg:pb-0 mb-5">
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-end lg:pl-10 order-last md:order-first">
          <div className="absolute -ml-10 lg:-ml-40 mt-20 mr-3 overlay z-50">
            <Image
              src="/images/homepage/bolts.svg"
              width="90"
              height="90"
              className="ml-12"
              alt="Good Party"
            />
          </div>
          <div className="w-auto ml-0 flex relative">
            <Image
              src="/images/homepage/genz.png"
              sizes="100vw"
              height={300}
              width={500}
              className="object-contain"
              alt=""
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 justify-self-center md:justify-self-start lg:pr-10 pl-10 mb-5">
          <div className="flex flex-row">
            <div className="flex flex-col text-xl mt-2 w-10 h-10 bg-purple-400 items-center justify-center rounded-lg -ml-14 -mr-4">
              <span class="text-slate-50 text-center">2</span>
            </div>
            <div className="text-2xl mt-2 text-start max-w-[300px] ml-10">
              Mobilize volunteers to support winning campaigns
            </div>
          </div>
          <div className="text-md mt-2 max-w-[300px]">
            We make it easy for voters to find exciting candidates both on their
            ballots and across the country! Plug into grassroots campaigns with
            our volunteer programs
          </div>
          <div className="mt-4">
            <Link href="/volunteer">
              <SecondaryButton size="medium">Volunteer</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 relative items-center pb-14 lg:pb-0 mb-5">
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-end lg:pr-10 mb-5">
          <div className="flex flex-row">
            <div className="flex flex-col text-xl mt-2 w-10 h-10 bg-orange-400 items-center justify-center rounded-lg -ml-14 -mr-4">
              <span class="text-indigo-800 text-center">3</span>
            </div>
            <div className="text-2xl mt-2 text-start max-w-[300px] ml-10">
              Make America a truly representative democracy
            </div>
          </div>
          <div className="text-md mt-2 max-w-[300px]">
            More viable independent options means less money in politics, less
            corruption, and more time focusing on the issues that matter most
          </div>
          <div className="mt-4">
            <Link href="/run-for-office">
              <SecondaryButton size="medium">Act now</SecondaryButton>
            </Link>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-start lg:pl-10">
          <div className="w-auto ml-0 flex relative">
            <Image
              src="/images/homepage/map.png"
              sizes="100vw"
              height={300}
              width={440}
              className="object-contain"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
