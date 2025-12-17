'use client'
import { createContext, useState, Dispatch, SetStateAction } from 'react'

interface CandidatePosition {
  id: number
  topIssueId: number
  positionId: number
  description: string
  order: number
}

type CandidatePositionsContextType = [
  CandidatePosition[],
  Dispatch<SetStateAction<CandidatePosition[]>>,
]

export const CandidatePositionsContext =
  createContext<CandidatePositionsContextType>([[], () => {}])

interface CandidatePositionsProviderProps {
  children: React.ReactNode
  candidatePositions?: CandidatePosition[]
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
