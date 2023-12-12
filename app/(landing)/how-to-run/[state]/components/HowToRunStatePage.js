import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import { slugify } from 'helpers/articleHelper';
import { shortToLongState } from 'helpers/statesHelper';
import Link from 'next/link';
import { Fragment } from 'react';
import Race from './Race';
import Breadcrumbs from '@shared/utils/Breadcrumbs';

export default function HowToRunStatePage(props) {
  const { state, counties, races } = props;
  const stateName = shortToLongState[state.toUpperCase()];

  const breadcrumbsLinks = [
    { href: `/how-to-run`, label: 'How to run' },
    {
      label: `how to run in ${stateName}`,
    },
  ];
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <H1 className="pt-12">
          How to Run in {shortToLongState[state.toUpperCase()]}
        </H1>

        <H2 className="mt-12">Counties Links {stateName}</H2>
        <div className="flex items-center flex-wrap mt-6">
          {counties.map((county) => (
            <div key={county.id} className="mr-4 pb-4">
              <Link href={`/how-to-run/${state}/${slugify(county.name, true)}`}>
                {county.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <H2>State level Races in {stateName}</H2>
          <div className="grid grid-cols-12 gap-6 mt-6">
            {races.map((race) => (
              <div
                key={race.id}
                className=" col-span-12 md:col-span-6 lg:col-span-4"
              >
                <Race race={race} />
              </div>
            ))}
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
