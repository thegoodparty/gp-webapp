'use client'

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import { Campaign } from 'helpers/types'

export const PublicCandidateContext = createContext<
  [Campaign | null, Dispatch<SetStateAction<Campaign | null>>]
>([null, () => {}])

export const usePublicCandidate = (): [
  Campaign | null,
  Dispatch<SetStateAction<Campaign | null>>,
] => useContext(PublicCandidateContext)

interface PublicCandidateProviderProps {
  children: ReactNode
  candidate: Campaign | null
}

export const PublicCandidateProvider = ({
  children,
  candidate: initCandidate,
}: PublicCandidateProviderProps): React.JSX.Element => {
  const [candidate, setCandidate] = useState<Campaign | null>(initCandidate)

  return (
    <PublicCandidateContext.Provider value={[candidate, setCandidate]}>
      {children}
    </PublicCandidateContext.Provider>
  )
}
