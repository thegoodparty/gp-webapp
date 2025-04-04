import MaxWidth from '@shared/layouts/MaxWidth';
import { shortToLongState } from 'helpers/statesHelper';
import RacesSection from '../../../../shared/RacesSection';
import LearnToRun from '../../../../shared/LearnToRun';
import Guides from '../../../../shared/Guides';
import Hero from '../../../components/Hero';
import CityFacts from './CityFacts';

export default function ElectionsCountyPage(props) {
  const { state, municipality, races, articles, county } = props;
  const stateName = shortToLongState[state.toUpperCase()];

  return (
    <div className="bg-indigo-50 pb-20">
      <Hero {...props} color1="#897AF1" color2="#C985F2" level="city" />
      <MaxWidth>
        <RacesSection races={races} />
      </MaxWidth>

      <CityFacts city={municipality} county={county} />

      <LearnToRun stateName={stateName} />
      <Guides articles={articles} />
    </div>
  );
}
