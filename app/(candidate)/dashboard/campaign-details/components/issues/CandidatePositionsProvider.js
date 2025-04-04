'use client'
import { createContext, useState } from 'react'

export const CandidatePositionsContext = createContext([[], (v) => {}])
export const CandidatePositionsProvider = ({
  children,
  candidatePositions: initialCandidatePositions = [],
}) => {
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
