import MaxWidth from '@shared/layouts/MaxWidth'
import { shortToLongState } from 'helpers/statesHelper'
import LinksSection from '../../../shared/LinksSection'
import RacesSection from '../../../shared/RacesSection'
import LearnToRun from '../../../shared/LearnToRun'
import Guides from '../../../shared/Guides'
import CountyFacts from './CountyFacts'
import Hero from '../../../shared/Hero'

export default function ElectionsCountyPage(props) {
  const { state, childEntities, races, articles, county } = props
  const stateName = shortToLongState[state.toUpperCase()]

  const cityLink = (city) => {
    return `/elections/${city.slug}`
  }
  return (
    <div className="bg-indigo-50 pb-20">
      <Hero {...props} color1="#2AC8E2" color2="#6a9de2" level="county" />
      <MaxWidth>
        <RacesSection races={races} />
      </MaxWidth>
      <div className="max-w-screen-xl mx-auto mt-20">
        <LinksSection
          entities={childEntities}
          linkFunc={cityLink}
          title={`Explore city elections in ${
            county?.name ? county.name : 'county'
          }`}
        />
      </div>
      <CountyFacts county={county} />

      <LearnToRun stateName={stateName} />
      <Guides articles={articles} />
    </div>
  )
}
