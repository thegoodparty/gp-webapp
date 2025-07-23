'use client'

import { createContext, useContext, useState } from 'react'

export const DomainStatusContext = createContext({
  status: null,
  setStatus: () => {},
})

export const useDomainStatus = () => useContext(DomainStatusContext)

export const DomainStatusProvider = ({ children, status: initStatus }) => {
  const [status, setStatus] = useState(initStatus)

  return (
    <DomainStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </DomainStatusContext.Provider>
  )
}
