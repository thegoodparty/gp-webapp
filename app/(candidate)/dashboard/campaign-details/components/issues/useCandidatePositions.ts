import { useContext } from 'react'
import { CandidatePositionsContext, CandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider'

export const useCandidatePositions = (): [
  CandidatePosition[],
  React.Dispatch<React.SetStateAction<CandidatePosition[]>>,
] => {
  const context = useContext(CandidatePositionsContext)
  if (!context) {
    throw new Error(
      'useCandidatePositions must be used within CandidatePositionsProvider',
    )
  }
  return context
}
