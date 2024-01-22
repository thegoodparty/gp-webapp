import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import { slugify } from 'helpers/articleHelper';
import { shortToLongState } from 'helpers/statesHelper';
import Link from 'next/link';
import { Fragment } from 'react';
import Race from '../../shared/Race';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Hero from './Hero';
import LinksSection from '../../shared/LinksSection';
import RacesSection from '../../shared/RacesSection';
import LearnToRun from '../../shared/LearnToRun';
import Guides from '../../shared/Guides';

export default function ElectionsStatePage(props) {
  const { state, childEntity, races, articles } = props;
  const stateName = shortToLongState[state.toUpperCase()];

  const countyLink = (county) => {
    console.log('county', county);
    return `/elections/${state}/${slugify(county.name, true)}`;
  };
  return (
    <div className="bg-slate-50 pb-20">
      <Hero {...props} color1="#3EE996" color2="#31D3C8" level="state" />
      <MaxWidth>
        <RacesSection races={races} />
      </MaxWidth>
      <div className="bg-primary pt-1 pb-20 mt-10">
        <div className="max-w-screen-xl mx-auto mt-20">
          <LinksSection
            entities={childEntity}
            linkFunc={countyLink}
            title={`Explore 2024 county elections in ${stateName}`}
          />
        </div>
      </div>
      <LearnToRun stateName={stateName} />
      <Guides articles={articles} />
    </div>
  );
}
