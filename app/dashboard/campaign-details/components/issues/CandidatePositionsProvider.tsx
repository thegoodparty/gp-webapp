'use client'
import { createContext, useState, Dispatch, SetStateAction } from 'react'
import { noop } from '@shared/utils/noop'

interface CandidatePosition {
  id: number
  topIssueId: number
  positionId: number
  description: string
  order: number
}

type CandidatePositionsContextType = [
  CandidatePosition[] | false,
  Dispatch<SetStateAction<CandidatePosition[] | false>>,
]

export const CandidatePositionsContext =
  createContext<CandidatePositionsContextType>([[], noop])

interface CandidatePositionsProviderProps {
  children: React.ReactNode
  candidatePositions?: CandidatePosition[] | false
}

export const CandidatePositionsProvider = ({
  children,
  candidatePositions: initialCandidatePositions = [],
}: CandidatePositionsProviderProps): React.JSX.Element => {
  const [candidatePositions, setCandidatePositions] = useState(
    initialCandidatePositions,
  )
  return (
    <CandidatePositionsContext.Provider
      value={[candidatePositions, setCandidatePositions]}
    >
      {children}
    </CandidatePositionsContext.Provider>
  )
}
