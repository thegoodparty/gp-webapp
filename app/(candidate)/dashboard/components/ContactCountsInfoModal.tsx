import { numberFormatter } from 'helpers/numberHelper'
import Modal from '@shared/utils/Modal'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import H6 from '@shared/typography/H6'
import H2 from '@shared/typography/H2'
import { VoterContactModalWrapper } from '../shared/VoterContactModalWrapper'

interface PathToVictoryData {
  projectedTurnout?: number
  voterContactGoal?: number
  winNumber?: number
}

interface ContactCountsInfoModalProps {
  open?: boolean
  setOpen?: () => void
  pathToVictory?: PathToVictoryData
}

export const ContactCountsInfoModal = ({
  open = true,
  setOpen = () => {},
  pathToVictory = {},
}: ContactCountsInfoModalProps): React.JSX.Element => {
  const {
    projectedTurnout,
    voterContactGoal,
    winNumber,
  } = pathToVictory

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
          <ol
            className="
              mt-6
              list-decimal
              list-inside
              [&>li]:marker:font-normal
              [&>li]:marker:text-base
              [&>li]:font-outfit
              [&>li]:mb-2
            "
          >
            <li>
              We expect{' '}
              <span className="font-semibold">
                {numberFormatter(projectedTurnout)}
              </span>{' '}
              people to vote on trends from similar previous elections in this district.
            </li>
            <li>
              You need{' '}
              <span className="font-semibold">
                {numberFormatter(winNumber)}
              </span>{' '}
              votes to win with <span className="font-semibold">50%</span> of
              the votes.
            </li>
            <li>
              To do that, you need to make{' '}
              <span className="font-semibold">
                {numberFormatter(voterContactGoal)}
              </span>{' '}
              voter contacts (<span className="font-semibold">5x</span> your
              votes needed to win).
            </li>
          </ol>
        </div>
      </VoterContactModalWrapper>
    </Modal>
  )
}
