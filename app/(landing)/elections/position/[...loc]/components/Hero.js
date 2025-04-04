import Breadcrumbs from '@shared/utils/Breadcrumbs';
import { shortToLongState } from 'helpers/statesHelper';
import Image from 'next/image';
import Subtitle2 from '@shared/typography/Subtitle2';
import { dateUsHelper } from 'helpers/dateHelper';
import { FaArrowRightLong } from 'react-icons/fa6';
import Link from 'next/link';

export default function Hero({
  state,
  county,
  municipality,
  level,
  normalizedPositionName,
  electionDate,
  filingDateEnd,
  loc,
  locationName,
}) {
  const stateName = shortToLongState[state.toUpperCase()];
  const breadcrumbsLinks = [
    { href: `/elections`, label: 'How to run' },
    {
      label: `How to run in ${stateName}`,
      href: `/elections/${state}`,
    },
  ];
  if ((level === 'city' && county) || (level === 'county' && county)) {
    breadcrumbsLinks[1].href = `/elections/${state.toLowerCase()}`;
    breadcrumbsLinks.push({
      label: `${locationName} county`,
      href: `/elections/${county.slug}`,
    });
  }
  if (level === 'city' && municipality) {
    breadcrumbsLinks[1].href = `/elections/${state.toLowerCase()}`;
    breadcrumbsLinks.push({
      label: municipality.name,
      href: `/elections/${municipality.slug}`,
    });
  }
  breadcrumbsLinks.push({
    label: normalizedPositionName,
  });

  let title = `Run for ${normalizedPositionName} in ${loc}`;

  return (
    <>
      <div className="py-8 md:mb-2">
        <Breadcrumbs links={breadcrumbsLinks} />
        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="col-span-12 md:col-span-9">
            <h1 className="text-3xl md:text-6xl font-medium">{title}</h1>
          </div>
          <div className="col-span-12 md:col-span-3  hidden justify-end md:block">
            <div className="w-1/4  md:w-full flex justify-end">
              <Image
                src={`/images/elections/states/${state.toLowerCase()}.png`}
                width={200}
                height={200}
                alt={stateName}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-5">
        <div className="flex justify-between md:items-end md:flex-row flex-col items-start">
          <h2 className="ml-2 font-semibold text-lg md:text-2xl">
            Election Date: {dateUsHelper(electionDate)}
            <div className="mt-2">
              Filing Deadline: {dateUsHelper(filingDateEnd)}
            </div>
          </h2>
          <div>
            <div className="items-center hidden md:flex">
              <Subtitle2 className="mr-3">Free tools to run and win</Subtitle2>
              <Image
                src="/images/black-logo.svg"
                width={208}
                height={40}
                alt="GoodParty.org"
              />
            </div>
            <Link id="election-position-run" href="/run-for-office">
              <div className="md:mt-2 justify-end flex items-center text-blue-500 ml-2 mt-3">
                <div className="mr-2">Get free tools to run and win</div>
                <FaArrowRightLong />
              </div>
            </Link>
          </div>
        </div>

        <div className="border-b border-slate-200 mt-5"></div>
      </div>
    </>
  );
}
