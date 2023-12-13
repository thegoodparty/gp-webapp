import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import { slugify } from 'helpers/articleHelper';
import { shortToLongState } from 'helpers/statesHelper';
import Link from 'next/link';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Race from '../../../components/Race';

export default function HowToRunCityPage(props) {
  const { state, municipality, races, county } = props;
  const stateName = shortToLongState[state.toUpperCase()];
  const countyName = `${municipality.county_name} County`;
  const cityName = `${municipality.city}`;

  const breadcrumbsLinks = [
    { href: `/how-to-run`, label: 'How to run' },
    {
      label: `how to run in ${stateName}`,
      href: `/how-to-run/${state}`,
    },
    {
      label: `how to run in ${countyName}`,
      href: `/how-to-run/${state}/${county}`,
    },
    {
      label: `how to run in ${countyName}`,
    },
  ];
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <H1 className="pt-12">
          How to Run in {cityName}, {stateName}
        </H1>

        <div className="mt-12">
          <H2>City level Races in {cityName}</H2>
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

        <H2 className="mt-12">City data</H2>
        <div className="grid grid-cols-12 gap-6 mt-6">
          {Object.keys(municipality).map((key) => (
            <div key={key} className=" col-span-12 md:col-span-6 lg:col-span-3">
              <div className=" font-semibold">{key}</div>
              <div className="mt-2 mb-6">{municipality[key]}</div>
            </div>
          ))}
        </div>
      </MaxWidth>
    </div>
  );
}
