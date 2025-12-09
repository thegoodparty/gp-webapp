'use client'

import React, { createContext, useState } from 'react'

type FlexibleObject = { [key: string]: string | number | boolean | object | null | undefined }

export interface CandidatePosition extends FlexibleObject {
  position?: { id?: string | number }
}

type CandidatePositionsContextValue = [
  CandidatePosition[],
  React.Dispatch<React.SetStateAction<CandidatePosition[]>>,
]

const noop = () => {}

export const CandidatePositionsContext = createContext<CandidatePositionsContextValue>([
  [],
  noop as React.Dispatch<React.SetStateAction<CandidatePosition[]>>,
])

interface CandidatePositionsProviderProps {
  children: React.ReactNode
  candidatePositions?: CandidatePosition[]
}

export const CandidatePositionsProvider = ({
  children,
  candidatePositions: initialCandidatePositions = [],
}: CandidatePositionsProviderProps): React.JSX.Element => {
  const [candidatePositions, setCandidatePositions] = useState<CandidatePosition[]>(
    initialCandidatePositions,
  )
  return (
    <CandidatePositionsContext.Provider value={[candidatePositions, setCandidatePositions]}>
      {children}
    </CandidatePositionsContext.Provider>
  )
}
