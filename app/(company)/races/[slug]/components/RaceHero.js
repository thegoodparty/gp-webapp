import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function RaceHero(props) {
  const { race } = props;

  return (
    <>
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 md:justify-items-center pt-10 bg-slate-50 items-stretch">
          <div className="col-span-12 lg:col-span-6 lg:pl-20 max-w-2xl p-10">
            <h1 className="text-6xl md:text-[92px] font-semibold">
              {race.heroTitle}
            </h1>
            <h2 className="text-lg font-sfpro font-normal leading-6 mt-5 max-w-md">
              {race.heroSubTitle}
            </h2>
            <div className="flex flex-col md:flex-row">
              <div className="mt-4">
                <Link href={`${race.heroButton1Link}`} id="candidates_tool">
                  <PrimaryButton size="medium">
                    {race.heroButton1Text}
                  </PrimaryButton>
                </Link>
              </div>
              <div className="mt-4 pl-0 md:pl-3">
                <Link href={`${race.heroButton2Link}`} id="candidates_academy">
                  <WarningButton size="medium">
                    {race.heroButton2Text}
                  </WarningButton>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 relative w-full h-auto lg:pt-10 items-center md:mt-[100px]">
            <Image
              src={race.heroImage}
              sizes="50vw"
              className="object-contain object-right-top"
              alt=""
              fill
              priority
            />
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex relative lg:w-full"></div>
          <div className="flex relative w-full h-[171px] md:h-[300px]">
            <Image
              src={race.skylineImage}
              sizes="50vw"
              className="object-cover object-right-top z-50"
              alt=""
              fill
              priority
            />
          </div>
        </div>
      </MaxWidth>

      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full -mt-[calc(100vw*.17)]" />
    </>
  );
}
