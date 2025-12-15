import Button from '@shared/buttons/Button'
import MaxWidth from '@shared/layouts/MaxWidth'
import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { slugify } from 'helpers/articleHelper'
import { numberFormatter } from 'helpers/numberHelper'
import Image from 'next/image'
import map from 'public/images/elections/map.png'

interface City {
  name: string
  slug: string
  race_count: number
}

async function fetchFeatured(): Promise<City[] | false> {
  try {
    const api = electionApiRoutes.places.featuredCities.path
    const payload = {
      count: 3,
    }
    return await unAuthElectionFetch(api, payload, 3600)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default async function FeaturedCities(): Promise<React.JSX.Element> {
  const featuredCities = await fetchFeatured()
  if (!featuredCities || !featuredCities.length) {
    return <div className="h-20 bg-primary-dark" />
  }

  const link = (city: City): string => {
    return `/elections/${city.slug}`
  }
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
              Featured districts
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
                    {numberFormatter(city.race_count)}
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
  )
}
