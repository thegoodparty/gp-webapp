import MaxWidth from '@shared/layouts/MaxWidth';
import SearchLocation from '../../shared/SearchLocation';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import { shortToLongState } from 'helpers/statesHelper';
import Image from 'next/image';
import H2 from '@shared/typography/H2';
import Subtitle2 from '@shared/typography/Subtitle2';
const year = new Date().getFullYear();

export default function Hero({ state, color1, color2, level }) {
  const stateName = shortToLongState[state.toUpperCase()];
  const breadcrumbsLinks = [
    { href: `/elections`, label: 'How to run' },
    {
      label: `how to run in ${stateName}`,
    },
  ];
  return (
    <>
      <div
        className="mb-8 md:mb-2"
        style={{
          backgroundImage: `linear-gradient(131deg, ${color1} 2.74%, ${color2} 55.07%)`,
        }}
      >
        <div className="bg-white bg-opacity-60 py-5">
          <MaxWidth>
            <SearchLocation initialState={state?.toUpperCase()} />
          </MaxWidth>
        </div>
        <div className="mt-8 md:mt-20">
          <MaxWidth>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-9">
                <Breadcrumbs links={breadcrumbsLinks} />
                <h1 className="text-3xl md:text-6xl font-medium">
                  Run for {stateName}
                  <br />
                  state office
                </h1>
              </div>
              <div className="col-span-12 md:col-span-3 flex justify-end md:block">
                <div className="w-1/4  md:w-full -mt-14 md:-mt-0">
                  <Image
                    src={`/images/elections/states/${state}.png`}
                    width={300}
                    height={300}
                    alt={stateName}
                  />
                </div>
              </div>
            </div>
          </MaxWidth>
          <div className="-mt-20  lg:-mt-40 bg-[linear-gradient(172deg,_rgba(0,0,0,0)_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />
        </div>
      </div>
      <div className="pb-5">
        <MaxWidth>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src={`/images/elections/${level}-select.svg`}
                alt="state"
                width={28}
                height={28}
              />
              <h2 className="ml-2 font-semibold text-lg md:text-2xl">
                {stateName} {level} elections {year}
              </h2>
            </div>
            <div className="items-center hidden md:flex">
              <Subtitle2 className="mr-3">Free tools to run and win</Subtitle2>
              <Image
                src="/images/black-logo.svg"
                width={208}
                height={40}
                alt="GOOD PARTY"
              />
            </div>
          </div>
          <div className="border-b border-slate-200 mt-5"></div>
        </MaxWidth>
      </div>
    </>
  );
}
