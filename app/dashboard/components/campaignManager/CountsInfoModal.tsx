import { useEffect, useState } from 'react'
import { noop } from '@shared/utils/noop'
import { numberFormatter } from 'helpers/numberHelper'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'
import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'
import { RaceTargetMetrics } from 'helpers/types'

const CONTACTS_STATS_ROUTE = 'GET /v1/contacts/stats'

const useRegisteredVoters = (enabled: boolean) => {
  const [registeredVoters, setRegisteredVoters] = useState<number | null>(null)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    clientRequest(CONTACTS_STATS_ROUTE, {})
      .then((res) => {
        if (cancelled) return
        setRegisteredVoters(res.data?.totalConstituents ?? null)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setRegisteredVoters(null)
        reportErrorToSentry(error, {
          context: 'dashboard.countsInfoModal.fetchContactsStats',
        })
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return registeredVoters
}

interface CountsInfoModalProps {
  open?: boolean
  setOpen?: () => void
  raceTargetMetrics?: RaceTargetMetrics | null
}

export const CountsInfoModal = ({
  open = true,
  setOpen = noop,
  raceTargetMetrics,
}: CountsInfoModalProps): React.JSX.Element => {
  const { projectedTurnout, winNumber } = raceTargetMetrics ?? {}
  const registeredVoters = useRegisteredVoters(open)
  const showRegisteredVoters = registeredVoters !== null && registeredVoters > 0

  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          trackEvent(EVENTS.Dashboard.PathToVictory.ExitUnderstand)
          setOpen()
        }
      }}
      title="Projected votes needed to win"
      dialogClassName="min-w-[80vw] lg:min-w-[540px] max-w-2xl"
      drawerClassName="px-4 pb-8"
    >
      <div className="p-2 font-opensans">
        <div className="text-lg font-semibold">
          Projected votes needed to win
        </div>
        <div className="mt-1.5 text-sm text-muted-foreground">
          This is how many votes you need to win the seat. We use a conservative
          target: 50% of the voters we expect to cast a ballot, plus one more
          vote.
        </div>

        <div className="mt-4 text-base font-semibold">
          How we calculate this number
        </div>
        <ol className="mt-1.5 list-decimal list-outside pl-5 space-y-2 text-sm [&>li]:list-item">
          {showRegisteredVoters ? (
            <li>
              There are{' '}
              <span className="font-semibold">
                {numberFormatter(registeredVoters)}
              </span>{' '}
              registered voters in your district. That&rsquo;s everyone who
              could cast a ballot.
            </li>
          ) : null}
          <li>
            Of those, we expect{' '}
            <span className="font-semibold">
              {numberFormatter(projectedTurnout)}
            </span>{' '}
            to actually vote, based on past elections like yours.
          </li>
          <li>
            To win, you need{' '}
            <span className="font-semibold">{numberFormatter(winNumber)}</span>{' '}
            of those voters on your side. That&rsquo;s just over half (
            <span className="font-semibold">50% + 1</span>).
          </li>
        </ol>

        <div className="mt-4 text-xs text-muted-foreground">
          Our turnout predictions come from a national voter file with more than
          240 million voters. To learn more, read{' '}
          <a
            href="https://goodparty.org/blog/article/calculate-win-numbers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            our blog post
          </a>
          .
        </div>
      </div>
    </ModalOrDrawer>
  )
}
