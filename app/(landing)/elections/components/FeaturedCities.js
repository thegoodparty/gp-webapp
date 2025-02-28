'use client';
import Button from '@shared/buttons/Button';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { slugify } from 'helpers/articleHelper';
import { isbot } from 'isbot';
import Image from 'next/image';
import map from 'public/images/elections/map.png';
import { useEffect, useState } from 'react';

const fetchLocFromIp = async () => {
  const resp = await fetch(
    'https://pro.ip-api.com/json/?fields=status,countryCode,region,city&key=c8O5omxoySWBzAi',
    {
      method: 'GET',
    },
  );
  return resp.json();
};

async function fetchFeatured(city, state) {
  try {
    const api = gpApi.race.proximity;
    const payload = {
      city,
      state,
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const defaultCities = [
  {
    name: 'Los Angeles',
    state: 'CA',
    slug: `ca/los-angeles/los-angeles`,
    openElections: 72,
  },
  {
    name: 'Austin',
    state: 'Tx',
    openElections: 68,
    slug: 'tx/travis/austin',
  },
  {
    name: 'San Diego',
    state: 'CA',
    openElections: 44,
    slug: 'ca/san%20diego/san%20diego',
  },
];
export default function FeaturedCities() {
  const [featuredCities, setFeaturedCities] = useState(defaultCities);

  // useEffect(() => {
  //   getIpLocation();
  // }, []);

  const getIpLocation = async () => {
    try {
      const isBot = isbot(navigator.userAgent);
      if (!isBot) {
        const { region, city, countryCode } = await fetchLocFromIp();

        if (countryCode !== 'US') {
          return;
        }
        const { cities } = await fetchFeatured(city, region);
        if (cities && cities.length > 0) {
          setFeaturedCities(cities);
        }

        console.log('region', region);
        console.log('city', city);
      }
    } catch (error) {
      console.log('error in getIpLocation', error);
    }
  };

  const link = (city) => {
    return `/elections/${city.slug}`;
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
        <div className="bg-primary-dark text-gray-50 -mt-[104px] md:-mt-[194px] pt-36 md:pt-40">
          <MaxWidth>
            <h2 className="text-3xl md:text-5xl font-semibold mb-10 md:mb-20">
              Featured cities
            </h2>
            <div className="grid grid-cols-12 gap-4">
              {featuredCities.map((city) => (
                <div
                  key={city.name}
                  className="col-span-12 md:col-span-4 text-center mb-10"
                >
                  <h3 className="text-slate-200 font-medium text-2xl md:text-3xl mb-2 md:mb-6">
                    {city.name}
                  </h3>
                  <div className=" text-blue-600 text-4xl md:text-7xl font-extrabold">
                    #{city.openElections}
                  </div>
                  <div className="text-slate-200 md:text-lg mt-1 md:mt-2">
                    open elections
                  </div>
                  <div className="mt-6 md:mt-10">
                    <Button
                      href={link(city)}
                      id={`view-city-${slugify(city.name, true)}`}
                      color="secondary"
                    >
                      View {city.name} elections
                    </Button>
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
