import MaxWidth from '@shared/layouts/MaxWidth';
import { shortToLongState } from 'helpers/statesHelper';
import Hero from './Hero';
import LinksSection from '../../shared/LinksSection';
import RacesSection from '../../shared/RacesSection';
import LearnToRun from '../../shared/LearnToRun';
import Guides from '../../shared/Guides';

export default function ElectionsStatePage(props) {
  const { state, childEntity, races, articles } = props;
  const stateName = shortToLongState[state.toUpperCase()];

  const countyLink = (county) => {
    return `/elections/${county.slug}`;
  };
  return (
    <div className="bg-indigo-50 pb-20">
      <Hero {...props} color1="#3EE996" color2="#31D3C8" level="state" />
      <MaxWidth>
        <RacesSection races={races} />
      </MaxWidth>
      <div className="bg-primary-dark pt-1 pb-20 mt-10">
        <div className="max-w-screen-xl mx-auto mt-20">
          <LinksSection
            entities={childEntity}
            linkFunc={countyLink}
            title={`Explore county elections in ${stateName}`}
          />
        </div>
      </div>
      <LearnToRun stateName={stateName} />
      <Guides articles={articles} />
    </div>
  );
}
