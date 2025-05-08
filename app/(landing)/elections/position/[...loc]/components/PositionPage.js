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
import { PositionLevel } from 'app/(landing)/elections/shared/PositionLevel'
import CandidateCard from 'app/candidate/[name]/[office]/components/CandidateCard'
import Link from 'next/link'
import H3 from '@shared/typography/H3'

export default function PositionPage(props) {
  const { race, otherRaces, articles, county, city, positions, candidates } = props
  const { positionLevel, state, Place } = race
  let loc = Place?.name || ''
  if (!positionLevel || positionLevel?.toUpperCase() === PositionLevel.LOCAL) {
    loc = `${Place?.name || ''}, ${race.state?.toUpperCase()}`
  }
  if (positionLevel?.toUpperCase() === PositionLevel.CITY) {
    loc += ` City, ${state?.toUpperCase()}`
  } else if (positionLevel?.toUpperCase() === PositionLevel.COUNTY) {
    loc += ` County, ${state?.toUpperCase()}`
  }

  const positionLink = (race) => {
    return `/elections/position/${state}/${county ? `${county}/` : ''}${
      city ? `${city}/` : ''
    }${race.slug}`
  }

  const candidateLink = (c) => `/candidate/${c.slug}`
  // const candidatesForLinks = candidates?.map((c) => ({
  //    ...c,
  //   name: `${c.firstName} ${c.lastName}`
  // }))

  race.loc = loc

  return (
    <div className="bg-indigo-100">
      <MaxWidth>
        <Hero {...race} />
        <PositionDetails race={race} positions={positions} />
        {/* ---------- Candidates running in this race ---------- */}
        {candidates?.length > 0 && (
          <section className="my-20">
            <H3 className="mb-8">
              Independent Candidates running for {race.normalizedPositionName}
            </H3>

            {/* grid → max 3 per row */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((c) => (
                <Link key={c.slug} href={candidateLink(c)} className="block">
                  <CandidateCard candidate={c} variant={'grid'} />
                </Link>
              ))}
            </div>
          </section>
        )}
        {/* ------------------------------------------------------ */}
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
