import Image from 'next/image';
import bgImg from '/public/images/homepage/post-2024.png';
import MaxWidth from '@shared/layouts/MaxWidth';
import Button from '@shared/buttons/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Link from 'next/link';

const fetchWinnerCount = async () => {
  const api = gpApi.campaign.mapCount;

  return await gpFetch(api, { results: true }, 3600);
};

export default async function Hero() {
  return (
    <MaxWidth>
      <div className="grid grid-cols-12 gap-4 lg:gap-8 md:justify-items-center pt-20 bg-indigo-50 items-stretch sm:p-8 md:px-10 lg:p-16 xl:px-0">
        <div className="col-span-12 lg:col-span-6">
          <h1 className="text-4xl leading-tight font-semibold xs:font-bold md:text-5xl md:leading-tight xl:text-6xl xl:leading-snug">
            We empowered 3,120 Independent wins in 2024 🎉
          </h1>
          <h2 className="text-lg font-sfpro font-normal leading-6 mt-8">
            GoodParty.org is empowering civic heroes to run, win, and serve as
            independent representatives for their communities.
          </h2>
          <h3 className="text-lg font-sfpro font-normal leading-6 mt-6">
            See where candidates won their elections in 2024 to transform civic
            leadership.
          </h3>
          <Button
            href="/candidates"
            size="large"
            className="mt-8 w-full md:w-auto"
          >
            Meet the Winners
          </Button>
        </div>
        <div className="col-span-12 lg:col-span-6 relative h-full">
          <Link href="/candidates" title="winners">
            <Image
              src={bgImg}
              sizes="50vw"
              className="object-contain object-right-top"
              alt=""
              priority
            />
          </Link>
        </div>
      </div>
    </MaxWidth>
  );
}
