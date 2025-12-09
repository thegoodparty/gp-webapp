'use client'

import React, { createContext, useContext, useState } from 'react'

// Flexible object shape for complex nested content as per project TS guidelines
// Avoids any/unknown while allowing realistic shapes used across the app
type FlexibleObject = { [key: string]: string | number | boolean | object | null | undefined }

export interface Domain extends FlexibleObject {
  name?: string
  status?: string
}

export interface Website extends FlexibleObject {
  id?: string | number
  vanityPath?: string
  status?: string
  domain?: Domain | null
  content?: FlexibleObject
}

export interface Contact extends FlexibleObject {
  createdAt?: string | number
  name?: string
  email?: string
  phone?: string | null
  message?: string
}

type ContactsState = Contact[] | FlexibleObject | null | undefined

interface WebsiteContextValue {
  website: Website | null
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>
  contacts: ContactsState
  setContacts: React.Dispatch<React.SetStateAction<ContactsState>>
}

const noop = () => {}

export const WebsiteContext = createContext<WebsiteContextValue>({
  website: null,
  setWebsite: noop as React.Dispatch<React.SetStateAction<Website | null>>,
  contacts: null,
  setContacts: noop as React.Dispatch<React.SetStateAction<ContactsState>>,
})

export const useWebsite = () => useContext(WebsiteContext)

interface WebsiteProviderProps {
  children: React.ReactNode
  website?: Website | null
  contacts?: ContactsState
}

export const WebsiteProvider = ({
  children,
  website: initWebsite,
  contacts: initContacts,
}: WebsiteProviderProps): React.JSX.Element => {
  const [website, setWebsite] = useState<Website | null>(initWebsite ?? null)
  const [contacts, setContacts] = useState<ContactsState>(initContacts ?? null)

  return (
    <WebsiteContext.Provider value={{ website, setWebsite, contacts, setContacts }}>
      {children}
    </WebsiteContext.Provider>
  )
}
