'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'
import type { Website, WebsiteContact } from 'helpers/types'

interface WebsiteContextType {
  website: Website | null
  setWebsite: Dispatch<SetStateAction<Website | null>>
  contacts: WebsiteContact[] | null
  setContacts: Dispatch<SetStateAction<WebsiteContact[] | null>>
}

export const WebsiteContext = createContext<WebsiteContextType>({
  website: null,
  setWebsite: () => {},
  contacts: null,
  setContacts: () => {},
})

export const useWebsite = (): WebsiteContextType => useContext(WebsiteContext)

interface WebsiteProviderProps {
  children: React.ReactNode
  website: Website | null
  contacts: WebsiteContact[] | null
}

export const WebsiteProvider = ({
  children,
  website: initWebsite,
  contacts: initContacts,
}: WebsiteProviderProps): React.JSX.Element => {
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
