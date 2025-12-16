'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

interface WebsiteContent {
  hero?: {
    headline?: string
    subheadline?: string
  }
  about?: {
    title?: string
    content?: string
  }
  theme?: {
    color?: string
  }
}

interface Website {
  id: number
  vanityPath: string
  status: string
  content: WebsiteContent | null
  domain?: { domain: string; status: string } | null
}

interface WebsiteContact {
  id: number
  email: string
  name?: string
  createdAt: string
}

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
