import { useCallback, useState } from 'react'
import { weeksTill } from 'helpers/dateHelper'
import { useCampaign } from '@shared/hooks/useCampaign'

type PrimaryResult = 'won' | 'lost'

export interface PostElectionState {
  electionInPast: boolean
  primaryLost: boolean
  primaryResultModalOpen: boolean
  primaryElectionDate: string | undefined
  electionDate: string | undefined
  closePrimaryResultModal: (result?: PrimaryResult) => void
}

export function usePostElectionState(): PostElectionState {
  const [campaign] = useCampaign()
  const { goals, details } = campaign || {}
  const { primaryElectionDate } = details || {}

  const [primaryResultState, setPrimaryResultState] = useState<{
    modalDismissed: boolean
    primaryResult: PrimaryResult | null | undefined
  }>({
    modalDismissed: false,
    primaryResult: campaign?.details?.primaryResult,
  })

  const electionDate = details?.electionDate || goals?.electionDate
  const now = new Date()
  const primaryElectionDateObj = primaryElectionDate
    ? new Date(primaryElectionDate)
    : null
  const primaryInFuture =
    primaryElectionDateObj !== null && primaryElectionDateObj > now
  const primaryInPast = primaryElectionDateObj !== null && !primaryInFuture
  const resolvedDate = primaryInFuture ? primaryElectionDate : electionDate

  const { modalDismissed, primaryResult } = primaryResultState
  const primaryResultModalOpen =
    primaryInPast && !primaryResult && !modalDismissed

  const weeksUntil = weeksTill(resolvedDate)
  const weeksUntilValue =
    typeof weeksUntil === 'object' && weeksUntil ? weeksUntil.weeks : NaN
  const electionInPast =
    weeksUntilValue < 0 && resolvedDate !== primaryElectionDate
  const primaryLost = primaryResult === 'lost'

  const closePrimaryResultModal = useCallback(
    (selectedResult?: PrimaryResult) => {
      if (selectedResult) {
        setPrimaryResultState({
          modalDismissed: false,
          primaryResult: selectedResult,
        })
      } else {
        setPrimaryResultState({
          modalDismissed: true,
          primaryResult: undefined,
        })
      }
    },
    [],
  )

  return {
    electionInPast,
    primaryLost,
    primaryResultModalOpen,
    primaryElectionDate,
    electionDate,
    closePrimaryResultModal,
  }
}
