'use client'

import { createContext, useContext, useState } from 'react'

export const PersonContext = createContext({
  person: null,
  setPerson: () => {},
})

export const usePerson = () => useContext(PersonContext)

export const PersonProvider = ({ children, person: initPerson }) => {
  const [person, setPerson] = useState(initPerson)
  return (
    <PersonContext.Provider value={[person, setPerson]}>
      {children}
    </PersonContext.Provider>
  )
}
