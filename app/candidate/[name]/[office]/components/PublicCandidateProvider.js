'use client'

import { createContext, useContext, useState } from 'react'

export const PublicCandidateContext = createContext([null, () => {}])

export const usePublicCandidate = () => useContext(PublicCandidateContext)

export const PublicCandidateProvider = ({
  children,
  candidate: initCandidate,
}) => {
  const [candidate, setCandidate] = useState(initCandidate)

  return (
    <PublicCandidateContext.Provider value={[candidate, setCandidate]}>
      {children}
    </PublicCandidateContext.Provider>
  )
}
