'use client'

import { createContext, useContext, useState } from 'react'

export const PublicCandidateContext = createContext({
  candidate: null,
  setCandidate: () => {},
})

export const usePublicCandidate = () => useContext(PublicCandidateContext)

export const PublicCandidateProvider = ({
  children,
  candidate: initCandidate,
}) => {
  const [candidate] = useState(initCandidate)

  return (
    <PublicCandidateContext.Provider value={[candidate]}>
      {children}
    </PublicCandidateContext.Provider>
  )
}
