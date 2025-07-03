'use client'

import { createContext, useContext, useState } from 'react'

export const WebsiteContext = createContext({
  website: null,
  setWebsite: () => {},
  contacts: null,
  setContacts: () => {},
})

export const useWebsite = () => useContext(WebsiteContext)

export const WebsiteProvider = ({
  children,
  website: initWebsite,
  contacts: initContacts,
}) => {
  const [website, setWebsite] = useState(initWebsite)
  const [contacts, setContacts] = useState(initContacts)

  return (
    <WebsiteContext.Provider
      value={{ website, setWebsite, contacts, setContacts }}
    >
      {children}
    </WebsiteContext.Provider>
  )
}
