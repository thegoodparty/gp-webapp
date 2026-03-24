import { noop } from '@shared/utils/noop'
import { numberFormatter } from 'helpers/numberHelper'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import H6 from '@shared/typography/H6'
import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'

interface PathToVictoryData {
  projectedTurnout?: number
  voterContactGoal?: number
  winNumber?: number
}

interface CountsInfoModalProps {
  open?: boolean
  setOpen?: () => void
  pathToVictory?: PathToVictoryData
}

export const CountsInfoModal = ({
  open = true,
  setOpen = noop,
  pathToVictory = {},
}: CountsInfoModalProps): React.JSX.Element => {
  const { projectedTurnout, voterContactGoal, winNumber } = pathToVictory

  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          trackEvent(EVENTS.Dashboard.PathToVictory.ExitUnderstand)
          setOpen()
        }
      }}
      title="Voter contacts needed"
      dialogClassName="min-w-[80vw] lg:min-w-[540px] max-w-2xl"
      drawerClassName="px-4 pb-8"
    >
      <div className="p-2">
        <div className="text-lg font-semibold">Voter contacts needed</div>
        <div className="mt-4 text-sm text-muted-foreground">
          A voter contact is when you make a meaningful contact with a voter.
          This could be a text message, robocall, talking to them in person,
          etc. To turn someone into your voter we recommend contacting them{' '}
          <H6 className="inline">5</H6> times across channels.
        </div>

        <div className="mt-8 mb-4 text-lg font-semibold">
          How we calculate this number
        </div>
        <ol className="list-decimal list-outside pl-5 space-y-2 text-sm text-muted-foreground [&>li]:list-item">
          <li>
            We expect{' '}
            <span className="font-semibold">
              {numberFormatter(projectedTurnout)}
            </span>{' '}
            people to vote on trends from similar previous elections in this
            district.
          </li>
          <li>
            You need{' '}
            <span className="font-semibold">{numberFormatter(winNumber)}</span>{' '}
            votes to win with <span className="font-semibold">50%</span> of the
            votes.
          </li>
          <li>
            To do that, you need to make{' '}
            <span className="font-semibold">
              {numberFormatter(voterContactGoal)}
            </span>{' '}
            voter contacts (<span className="font-semibold">5x</span> your votes
            needed to win).
          </li>
        </ol>
      </div>
    </ModalOrDrawer>
  )
}
