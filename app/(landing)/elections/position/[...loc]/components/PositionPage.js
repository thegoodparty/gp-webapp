import MaxWidth from '@shared/layouts/MaxWidth';

import Hero from './Hero';
import PositionDetails from './PositionDetails';
import CtaBanner from './CtaBanner';
import PositionFaqs from './PositionFaqs';
import Tools from 'app/(landing)/elections/components/Tools';
import LinksSection from 'app/(landing)/elections/shared/LinksSection';
import Guides from 'app/(landing)/elections/shared/Guides';
import Explore from './Explore';
import VwoVariable from './VwoVariable';

export default function PositionPage(props) {
  const { race, otherRaces, articles, county, city, positions } = props;
  const { level, state, locationName } = race;
  let loc = locationName;
  if (level === 'local') {
    loc += `${race.municipality?.name}, ${race.state.toUpperCase()}`;
  }
  if (level === 'city') {
    loc += `, ${state.toUpperCase()}`;
  } else if (level === 'county') {
    loc += ` County, ${state.toUpperCase()}`;
  } else if (level === 'state') {
  }

  const positionLink = (race) => {
    return `/elections/position/${state}/${county ? `${county}/` : ''}${
      city ? `${city}/` : ''
    }${race.slug}`;
  };
  race.loc = loc;

  return (
    <div className="bg-indigo-200">
      <MaxWidth>
        {/* <Breadcrumbs links={breadcrumbsLinks} /> */}
        <Hero {...race} />
        <PositionDetails race={race} positions={positions} />
      </MaxWidth>

      <CtaBanner race={race} />
      <PositionFaqs race={race} />
      <div className="bg-primary-dark  md:pb-24">
        <Tools negativeMargin={false} />
        <div className="max-w-screen-xl mx-auto md:mt-24">
          <LinksSection
            entities={otherRaces}
            linkFunc={positionLink}
            title={`Explore all 2024 ${loc} city elections`}
          />
        </div>
      </div>
      <Guides articles={articles} />
      <Explore />
      <VwoVariable race={race} />
    </div>
  );
}
