import MaxWidth from '@shared/layouts/MaxWidth'
import { shortToLongState, isStateAbbreviation } from 'helpers/statesHelper'
import CityFacts from './CityFacts'
import RacesSection from 'app/(landing)/elections/shared/RacesSection'
import LearnToRun from 'app/(landing)/elections/shared/LearnToRun'
import Guides from 'app/(landing)/elections/shared/Guides'
import Hero from '../../../../shared/Hero'
import { Race, Article, City, County, Parent, Municipality } from 'app/(landing)/elections/shared/types'

interface ElectionsCityPageProps {
  state: string
  municipality: City
  races: Race[]
  articles: Article[]
  county: County
  parent?: Parent
}

export default function ElectionsCountyPage(props: ElectionsCityPageProps): React.JSX.Element {
  const { state, municipality, races, articles, county, parent } = props
  const upperState = state.toUpperCase()
  const stateName = isStateAbbreviation(upperState) ? shortToLongState[upperState] : upperState

  const municipalityWithState: Municipality = {
    name: municipality.name,
    slug: municipality.slug,
    state,
  }

  return (
    <div className="bg-indigo-50 pb-20">
      <Hero
        state={state}
        municipality={municipalityWithState}
        county={county}
        parent={parent}
        color1="#897AF1"
        color2="#C985F2"
        level="city"
      />
      <MaxWidth>
        <RacesSection races={races} />
      </MaxWidth>

      <CityFacts city={municipality} />

      <LearnToRun stateName={stateName} />
      <Guides articles={articles} />
    </div>
  )
}
