import MaxWidth from '@shared/layouts/MaxWidth'
import { isStateAbbreviation, shortToLongState } from 'helpers/statesHelper'
import CityFacts from './CityFacts'
import RacesSection from 'app/(landing)/elections/shared/RacesSection'
import LearnToRun from 'app/(landing)/elections/shared/LearnToRun'
import Guides from 'app/(landing)/elections/shared/Guides'
import Hero from '../../../../shared/Hero'
import { Article, City, Municipality, Parent, Race } from 'app/(landing)/elections/shared/types'
import { PlaceResult, PlaceParent } from 'app/(landing)/elections/shared/fetchPlace'

interface ElectionsCityPageProps {
  state: string
  municipality: City | PlaceResult
  races?: Race[]
  articles?: Article[]
  county: string
  parent?: Parent | PlaceParent
}

const ElectionsCountyPage = (props: ElectionsCityPageProps): React.JSX.Element => {
  const { state, municipality, races, articles, county, parent } = props
  const upperState = state.toUpperCase()
  const stateName = isStateAbbreviation(upperState)
    ? shortToLongState[upperState]
    : state
  const municipalityWithState: Municipality = {
    name: municipality.name || '',
    slug: municipality.slug || '',
    state,
  }

  return (
    <div className="bg-indigo-50 pb-20">
      <Hero
        state={state}
        municipality={municipalityWithState}
        parent={parent}
        color1="#897AF1"
        color2="#C985F2"
        level="city"
      />
      <MaxWidth>
        <RacesSection races={races} />
      </MaxWidth>

      <CityFacts city={municipality} county={county} />

      <LearnToRun stateName={stateName} />
      <Guides articles={articles} />
    </div>
  )
}

export default ElectionsCountyPage
