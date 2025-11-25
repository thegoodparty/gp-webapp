import MaxWidth from '@shared/layouts/MaxWidth'
import { shortToLongState } from 'helpers/statesHelper'
import Hero from '../../shared/Hero'
import LinksSection from '../../shared/LinksSection'
import RacesSection from '../../shared/RacesSection'
import LearnToRun from '../../shared/LearnToRun'
import Guides from '../../shared/Guides'

interface Place {
  slug: string
}

export default function ElectionsStatePage(props: Record<string, unknown>): React.JSX.Element {
  const {
    state,
    categorizedChildren = {},
    children = [],
    races,
    articles,
  } = props as {
    state: string
    categorizedChildren: {
      counties?: Place[]
      districts?: Place[]
      others?: Place[]
    }
    children: Place[]
    races: unknown[]
    articles: unknown[]
  }

  const { counties = [], districts = [], others = [] } = categorizedChildren

  const stateName = (shortToLongState as Record<string, string>)[state.toUpperCase()]

  const placeLink = (place: Place) => `/elections/${place.slug}`

    return (
      <div className="bg-indigo-50 pb-20">
        <Hero state={state} county={null} color1="#3EE996" color2="#31D3C8" level="state" municipality={null} parent={null} />
  
        <MaxWidth>
          <RacesSection races={races} />
        </MaxWidth>
  
        <div className="bg-primary-dark pt-1 pb-20 mt-10">
          <div className="max-w-screen-xl mx-auto mt-20">
            <div className="rounded-2xl bg-white px-8 py-10 space-y-16">

              {children.length > 0 && (
                <LinksSection
                  entities={children}
                  linkFunc={placeLink}
                  title={`Explore elections in ${stateName}`}
                />
              )}

              {counties.length > 0 && (
                <LinksSection
                  entities={counties}
                  linkFunc={placeLink}
                  title={`Explore county elections in ${stateName}`}
                />
              )}
  
              {districts.length > 0 && (
                <LinksSection
                  entities={districts}
                  linkFunc={placeLink}
                  title={`Explore district elections in ${stateName}`}
                />
              )}
  
              {others.length > 0 && (
                <LinksSection
                  entities={others}
                  linkFunc={placeLink}
                  title={`Explore other elections in ${stateName}`}
                />
              )}
  
            </div>
          </div>
        </div>
  
        <LearnToRun stateName={stateName} />
        <Guides articles={articles} />
      </div>
    )
  }
