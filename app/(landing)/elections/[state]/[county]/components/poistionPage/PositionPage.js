import MaxWidth from '@shared/layouts/MaxWidth';

import { shortToLongState } from 'helpers/statesHelper';
import Hero from './Hero';
import PositionDetails from './PositionDetails';
import CtaBanner from './CtaBanner';
import PositionFaqs from './PositionFaqs';
import Tools from 'app/(landing)/elections/components/Tools';
import LinksSection from 'app/(landing)/elections/shared/LinksSection';
import { slugify } from 'helpers/articleHelper';
import Guides from 'app/(landing)/elections/shared/Guides';
import Explore from './Explore';

export default function PositionPage(props) {
  const { race, otherRaces, articles } = props;
  const { level, state, locationName } = race;
  console.log('otherRce', otherRaces);

  let loc = locationName;
  if (level === 'city') {
    loc += `, ${state}`;
  } else if (level === 'county') {
    loc += ` County, ${state}`;
  } else if (level === 'state') {
  }

  const positionLink = (race) => {
    const slug = slugify(race.name, true);
    return `/elections/${slug}/${race.hashId}/`;
  };
  race.loc = loc;

  return (
    <div className="bg-slate-50">
      <MaxWidth>
        {/* <Breadcrumbs links={breadcrumbsLinks} /> */}
        <Hero {...race} />
        <PositionDetails race={race} />
      </MaxWidth>

      <CtaBanner race={race} />
      <PositionFaqs race={race} />
      <div className="bg-primary  md:pb-24">
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
    </div>
  );
}
