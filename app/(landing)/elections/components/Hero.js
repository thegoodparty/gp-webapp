import MaxWidth from '@shared/layouts/MaxWidth';
import MarketingH1 from '@shared/typography/MarketingH1';
import Image from 'next/image';
import SearchLocation from '../shared/SearchLocation';

export default function Hero() {
  return (
    <div className="pt-20">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-4 items-center mb-5 md:mb-12 lg:mb-16">
          <div className=" col-span-10 lg:col-span-8">
            <h1 className="font-semibold text-4xl md:text-6xl lg:text-8xl">
              Explore elections in your community
            </h1>
          </div>
          <div className="col-span-2 lg:col-span-4">
            <Image
              src="/images/logo/heart.svg"
              alt="GoodParty"
              width={188}
              height={152}
              className="w-16 md:w-24 lg:w-[188px]"
              priority
            />
          </div>
        </div>
        <SearchLocation withHeader />
        <div className="h-3"></div>
      </MaxWidth>
    </div>
  );
}
