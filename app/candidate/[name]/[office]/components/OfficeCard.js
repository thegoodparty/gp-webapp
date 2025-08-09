'use client'
import StickyCard from './StickyCard'
import { usePublicCandidate } from './PublicCandidateProvider'
import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import H4 from '@shared/typography/H4'
import { dateUsHelper } from 'helpers/dateHelper'
import LinksSection from './LinksSection'
import H3 from '@shared/typography/H3'

export default function OfficeCard(props) {
  const [candidate] = usePublicCandidate()
  const { party, positionDescription, electionFrequency, Race } = candidate

  const { electionDate } = Race || {}
  let partyName = ''
  if (party === 'Independent') {
    partyName = 'Non-Partisan Candidate'
  }

  return (
    <section className="mb-4 lg:w-[400px] lg:mr-4 lg:mt-32 pt-12 md:pt-0 text-black">
      <LinksSection />

      <StickyCard>
        <div className="mb-4 lg:w-[400px] lg:pb-4 ">
          <Paper>
            <H3>About The Office</H3>
            <Body1 className="mt-4 pb-4">{positionDescription}</Body1>
            <H4 className="mt-4 border-t border-gray-200 pt-4">Term Length</H4>
            <Body1 className="mt-1 pb-4 ">
              {electionFrequency?.length
                ? `${electionFrequency[0]} years`
                : 'Unknown'}
            </Body1>
            {electionDate && (
              <>
                <H4 className="mt-4 border-t border-gray-200 pt-4">
                  Election Date
                </H4>
                <Body1 className="mt-1 pb-4 ">
                  {dateUsHelper(electionDate)}
                </Body1>
              </>
            )}
          </Paper>
        </div>
      </StickyCard>
    </section>
  )
}
