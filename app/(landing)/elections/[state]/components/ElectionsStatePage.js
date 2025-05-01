import MaxWidth from '@shared/layouts/MaxWidth'
import { shortToLongState } from 'helpers/statesHelper'
import Hero from '../../shared/Hero'
import LinksSection from '../../shared/LinksSection'
import RacesSection from '../../shared/RacesSection'
import LearnToRun from '../../shared/LearnToRun'
import Guides from '../../shared/Guides'

export default function ElectionsStatePage(props) {
  const {
    state,
    categorizedChildren: { counties = [], districts = [], others = [] },
    races,
    articles,
  } = props

  const stateName = shortToLongState[state.toUpperCase()]

  const placeLink = (place) => `/elections/${place.slug}`

    return (
      <div className="bg-indigo-50 pb-20">
        <Hero {...props} color1="#3EE996" color2="#31D3C8" level="state" />
  
        {/* races */}
        <MaxWidth>
          <RacesSection races={races} />
        </MaxWidth>
  
        {/* one dark band → one white card with all three link lists */}
        <div className="bg-primary-dark pt-1 pb-20 mt-10">
          <div className="max-w-screen-xl mx-auto mt-20">
            <div className="rounded-2xl bg-white px-8 py-10 space-y-16">
  
              {/* counties */}
              {counties.length > 0 && (
                <LinksSection
                  entities={counties}
                  linkFunc={placeLink}
                  title={`Explore county elections in ${stateName}`}
                />
              )}
  
              {/* districts */}
              {districts.length > 0 && (
                <LinksSection
                  entities={districts}
                  linkFunc={placeLink}
                  title={`Explore district elections in ${stateName}`}
                />
              )}
  
              {/* others */}
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
