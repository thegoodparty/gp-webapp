'use client'

import React, { createContext, useContext, useState } from 'react'

type FlexibleObject = { [key: string]: string | number | boolean | object | null | undefined }

export interface DomainStatus extends FlexibleObject {
  message?: string
  paymentStatus?: string
}

interface DomainStatusContextValue {
  status: DomainStatus | null
  setStatus: React.Dispatch<React.SetStateAction<DomainStatus | null>>
}

const noop = () => {}

export const DomainStatusContext = createContext<DomainStatusContextValue>({
  status: null,
  setStatus: noop as React.Dispatch<React.SetStateAction<DomainStatus | null>>,
})

export const useDomainStatus = () => useContext(DomainStatusContext)

interface DomainStatusProviderProps {
  children: React.ReactNode
  status?: DomainStatus | null
}

export const DomainStatusProvider = ({
  children,
  status: initStatus,
}: DomainStatusProviderProps): React.JSX.Element => {
  const [status, setStatus] = useState<DomainStatus | null>(initStatus ?? null)

  return (
    <DomainStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </DomainStatusContext.Provider>
  )
}
