'use client'

import { createContext, useContext, useState } from 'react'

export const PeopleContext = createContext({
  people: [],
  setPeople: () => {},
})

export const usePeople = () => useContext(PeopleContext)

export const PeopleProvider = ({ children, people: initPeople }) => {
  const [people, setPeople] = useState(initPeople)

  return (
    <PeopleContext.Provider value={[people, setPeople]}>
      {children}
    </PeopleContext.Provider>
  )
}
