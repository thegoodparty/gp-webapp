'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const ContactsContext = createContext({
  contacts: [],
  setContacts: () => {},
})

export const useContacts = () => useContext(ContactsContext)

export const ContactsProvider = ({ children, contacts: initContacts }) => {
  const [contacts, setContacts] = useState(initContacts)

  useEffect(() => {
    setContacts(initContacts)
  }, [initContacts])

  return (
    <ContactsContext.Provider value={[contacts, setContacts]}>
      {children}
    </ContactsContext.Provider>
  )
}
