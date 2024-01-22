import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import { slugify } from 'helpers/articleHelper';
import { shortToLongState } from 'helpers/statesHelper';
import Link from 'next/link';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Race from '../../../shared/Race';

export default function ElectionsCountyPage(props) {
  const { state, childEntities, races, county } = props;
  const stateName = shortToLongState[state.toUpperCase()];
  const countyName = `${county?.county} County`;

  const breadcrumbsLinks = [
    { href: `/elections`, label: 'How to run' },
    {
      label: `how to run in ${stateName}`,
      href: `/elections/${state}`,
    },
    {
      label: `how to run in ${countyName}`,
    },
  ];
  return (
    <div className="">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <H1 className="pt-12">
          How to Run in {countyName}, {stateName}
        </H1>

        <H2 className="mt-12">Cities in {countyName}</H2>
        <div className="flex items-center flex-wrap mt-6">
          {childEntities.map((entity) => (
            <div key={entity.id} className="mr-4 pb-4">
              <Link
                href={`/elections/${state}/${slugify(
                  county.county,
                  true,
                )}/${slugify(entity.name, true)}`}
              >
                {entity.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <H2>County level Races in {countyName}</H2>
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

        <H2 className="mt-12">County data</H2>
        <div className="grid grid-cols-12 gap-6 mt-6">
          {Object.keys(county).map((key) => (
            <div key={key} className=" col-span-12 md:col-span-6 lg:col-span-3">
              <div className=" font-semibold">{key}</div>
              <div className="mt-2 mb-6">{county[key]}</div>
            </div>
          ))}
        </div>
      </MaxWidth>
    </div>
  );
}
