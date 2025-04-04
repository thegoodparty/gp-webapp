import { numberFormatter } from 'helpers/numberHelper'
import Modal from '@shared/utils/Modal'
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import H6 from '@shared/typography/H6'
import H2 from '@shared/typography/H2'
import { VoterContactModalWrapper } from '../shared/VoterContactModalWrapper'

export const ContactCountsInfoModal = ({
  open = true,
  setOpen = () => {},
  pathToVictory = {},
}) => {
  const {
    totalRegisteredVoters,
    projectedTurnout,
    voterContactGoal,
    winNumber,
  } = pathToVictory
  const turnoutPerc = numberFormatter(
    totalRegisteredVoters
      ? (projectedTurnout / totalRegisteredVoters) * 100
      : 0,
  )

  return (
    <Modal
      open={open}
      closeCallback={() => {
        trackEvent(EVENTS.Dashboard.PathToVictory.ExitUnderstand)
        setOpen()
      }}
    >
      <VoterContactModalWrapper>
        <div className="text-center">
          <H1>Voter contacts needed</H1>
          <Body2 className="mt-4 text-lg">
            A voter contact is when you make a meaningful contact with a voter.
            This could be a text message, robocall, talking to them in person,
            etc. To turn someone into your voter we recommend contacting them{' '}
            <H6 className="inline">5</H6> times across channels.
          </Body2>
        </div>

        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <H2 className="text-center">How we calculate this number</H2>
          <ol className="mt-6 space-y-4 list-decimal list-inside text-lg [&>li]:marker:font-normal [&>li]:marker:text-base">
            <li>
              <Body2 className="inline">
                There are{' '}
                <H6 className="inline">
                  {numberFormatter(totalRegisteredVoters)}
                </H6>{' '}
                total voters in your district.
              </Body2>
            </li>
            <li>
              <Body2 className="inline">
                We expect{' '}
                <H6 className="inline">{numberFormatter(projectedTurnout)}</H6>{' '}
                people to vote based on previous elections (
                <H6 className="inline">{turnoutPerc}%</H6> turnout).
              </Body2>
            </li>
            <li>
              <Body2 className="inline">
                You need{' '}
                <H6 className="inline">{numberFormatter(winNumber)}</H6> votes
                to win with <H6 className="inline">50%</H6> of the votes.
              </Body2>
            </li>
            <li>
              <Body2 className="inline">
                To do that, you need to make{' '}
                <H6 className="inline">{numberFormatter(voterContactGoal)}</H6>{' '}
                voter contacts (<H6 className="inline">5x</H6> your votes needed
                to win).
              </Body2>
            </li>
          </ol>
        </div>
      </VoterContactModalWrapper>
    </Modal>
  )
}
