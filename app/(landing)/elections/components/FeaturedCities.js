import WarningButton from '@shared/buttons/WarningButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import { slugify } from 'helpers/articleHelper';
import Image from 'next/image';
import Link from 'next/link';
import map from 'public/images/elections/map.png';

const cities = [
  { name: 'Los Angeles', state: 'CA', county: 'Los Angeles', openElections: 2 },
  { name: 'Austin', state: 'Tx', county: 'Whatever', openElections: 3 },
  {
    name: 'San Diego',
    state: 'CA',
    county: 'San Diego',
    openElections: 133,
  },
];
export default function FeaturedCities() {
  const link = (city) => {
    return `/elections/${city.state.toLowerCase()}/${city.county.toLowerCase()}/${city.name.toLowerCase()}`;
  };
  return (
    <section>
      <div className="-mt-14 md:-mt-36">
        <MaxWidth>
          <div className="flex justify-end">
            <Image
              src={map}
              alt="map"
              width={471}
              height={337}
              className="w-[223px] md:w-[471px] "
            />
          </div>
        </MaxWidth>
        <div className="bg-primary text-gray-50 -mt-[104px] md:-mt-[194px] pt-36 md:pt-40">
          <MaxWidth>
            <h2 className="text-3xl md:text-5xl font-semibold mb-10 md:mb-20">
              Featured cities
            </h2>
            <div className="grid grid-cols-12 gap-4">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="col-span-12 md:col-span-4 text-center mb-10"
                >
                  <h3 className="text-slate-700 font-medium text-2xl md:text-3xl mb-2 md:mb-6">
                    {city.name}
                  </h3>
                  <div className=" text-blue-600 text-4xl md:text-7xl font-extrabold">
                    #{city.openElections}
                  </div>
                  <div className="text-slate-700 md:text-lg mt-1 md:mt-2">
                    open elections
                  </div>
                  <div className="mt-6 md:mt-10">
                    <Link
                      href={link(city)}
                      id={`view-city-${slugify(city.name, true)}`}
                    >
                      <WarningButton size="medium">
                        View {city.name} elections
                      </WarningButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </MaxWidth>
        </div>
      </div>
    </section>
  );
}
