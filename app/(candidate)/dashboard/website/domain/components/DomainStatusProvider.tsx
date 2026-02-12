'use client'

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

export interface DomainStatus {
  status?: string
  domain?: string
  verificationStatus?: string
  message?: string
  paymentStatus?: string
}

interface DomainStatusContextType {
  status: DomainStatus | null
  setStatus: Dispatch<SetStateAction<DomainStatus | null>>
}

export const DomainStatusContext = createContext<DomainStatusContextType>({
  status: null,
  setStatus: () => {},
})

export const useDomainStatus = (): DomainStatusContextType =>
  useContext(DomainStatusContext)

interface DomainStatusProviderProps {
  children: React.ReactNode
  status: DomainStatus | null
}

export const DomainStatusProvider = ({
  children,
  status: initStatus,
}: DomainStatusProviderProps): React.JSX.Element => {
  const [status, setStatus] = useState(initStatus)

  return (
    <DomainStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </DomainStatusContext.Provider>
  )
}
