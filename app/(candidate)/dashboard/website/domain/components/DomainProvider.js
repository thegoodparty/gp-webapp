'use client'

import { createContext, useContext, useState } from 'react'

export const DomainContext = createContext({
  domain: null,
  setDomain: () => {},
})

export const useDomain = () => useContext(DomainContext)

export const DomainProvider = ({ children, domain: initDomain }) => {
  const [domain, setDomain] = useState(initDomain)

  return (
    <DomainContext.Provider value={{ domain, setDomain }}>
      {children}
    </DomainContext.Provider>
  )
}
