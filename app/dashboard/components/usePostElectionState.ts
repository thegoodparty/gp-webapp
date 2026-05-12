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
    modalOpen: boolean
    modalDismissed: boolean
    primaryResult: PrimaryResult | null | undefined
  }>({
    modalOpen: false,
    modalDismissed: false,
    primaryResult: campaign?.details?.primaryResult,
  })

  const electionDate = details?.electionDate || goals?.electionDate
  const now = new Date()
  let resolvedDate = electionDate

  if (primaryElectionDate) {
    const primaryElectionDateObj = new Date(primaryElectionDate)
    const { modalOpen, primaryResult, modalDismissed } = primaryResultState

    if (primaryElectionDateObj > now) {
      resolvedDate = primaryElectionDate
    } else if (!primaryResult && !modalOpen && !modalDismissed) {
      setPrimaryResultState((state) => ({ ...state, modalOpen: true }))
    }
  }

  const weeksUntil = weeksTill(resolvedDate)
  const weeksUntilValue =
    typeof weeksUntil === 'object' && weeksUntil ? weeksUntil.weeks : NaN
  const electionInPast =
    weeksUntilValue < 0 && resolvedDate !== primaryElectionDate
  const primaryLost = primaryResultState.primaryResult === 'lost'

  const closePrimaryResultModal = useCallback(
    (selectedResult?: PrimaryResult) => {
      if (selectedResult) {
        setPrimaryResultState((state) => ({
          ...state,
          modalOpen: false,
          primaryResult: selectedResult,
        }))
      } else {
        setPrimaryResultState({
          modalOpen: false,
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
    primaryResultModalOpen: primaryResultState.modalOpen,
    primaryElectionDate,
    electionDate,
    closePrimaryResultModal,
  }
}
