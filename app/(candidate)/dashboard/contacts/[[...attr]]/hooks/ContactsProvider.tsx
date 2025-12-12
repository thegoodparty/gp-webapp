'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { type ListContactsResponse } from '../components/shared/ajaxActions'

type ContactsContextValue = [
  ListContactsResponse | null,
  Dispatch<SetStateAction<ListContactsResponse | null>>,
]

export const ContactsContext = createContext<ContactsContextValue>([
  null,
  () => {},
])

export const useContacts = (): ContactsContextValue =>
  useContext(ContactsContext)

interface ContactsProviderProps {
  children: ReactNode
  contacts?: ListContactsResponse | null
}

export const ContactsProvider = ({
  children,
  contacts: initContacts,
}: ContactsProviderProps) => {
  const [contacts, setContacts] = useState<ListContactsResponse | null>(
    initContacts || null,
  )

  useEffect(() => {
    setContacts(initContacts || null)
  }, [initContacts])

  return (
    <ContactsContext.Provider value={[contacts, setContacts]}>
      {children}
    </ContactsContext.Provider>
  )
}

