import MaxWidth from '@shared/layouts/MaxWidth'

import Hero from './Hero'
import PositionDetails from './PositionDetails'
import CtaBanner from './CtaBanner'
import PositionFaqs from './PositionFaqs'
import Tools from 'app/(landing)/elections/components/Tools'
import LinksSection from 'app/(landing)/elections/shared/LinksSection'
import Guides from 'app/(landing)/elections/shared/Guides'
import Explore from './Explore'
import VwoVariable from './VwoVariable'

export default function PositionPage(props) {
  const { race, otherRaces, articles, county, city, positions } = props
  const { level, state, locationName } = race
  let loc = locationName
  if (!level || level?.toLowerCase() === 'local') {
    loc = `${
      locationName || race.municipality?.name || ''
    }, ${race.state?.toUpperCase()}`
  }
  if (level?.toLowerCase() === 'city') {
    loc += `, ${state?.toUpperCase()}`
  } else if (level?.toLowerCase() === 'county') {
    loc += ` County, ${state?.toUpperCase()}`
  } else if (level?.toLowerCase() === 'state') {
  }

  const positionLink = (race) => {
    return `/elections/position/${state}/${county ? `${county}/` : ''}${
      city ? `${city}/` : ''
    }${race.slug}`
  }
  race.loc = loc

  return (
    <div className="bg-indigo-100">
      <MaxWidth>
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
            title={`Explore all ${loc} city elections`}
          />
        </div>
      </div>
      <Guides articles={articles} />
      <Explore />
      <VwoVariable race={race} />
    </div>
  )
}
