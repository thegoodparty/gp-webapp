import { useContext } from 'react'
import { CandidatePositionsContext } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider'

export const useCandidatePositions = () => {
  const context = useContext(CandidatePositionsContext)
  if (!context) {
    throw new Error(
      'useCandidatePositions must be used within CandidatePositionsProvider',
    )
  }
  return context
}
