'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

export const PersonContext = createContext<[
  Record<string, string | number | boolean | object | null> | null,
  Dispatch<SetStateAction<Record<string, string | number | boolean | object | null> | null>>
] | null>(null)

export const usePerson = (): [
  Record<string, string | number | boolean | object | null> | null,
  Dispatch<SetStateAction<Record<string, string | number | boolean | object | null> | null>>
] => {
  const context = useContext(PersonContext)
  if (!context) {
    throw new Error('usePerson must be used within a PersonProvider')
  }
  return context
}

interface PersonProviderProps {
  children: React.ReactNode
  person: Record<string, string | number | boolean | object | null> | null
}

export const PersonProvider = ({ children, person: initPerson }: PersonProviderProps): React.JSX.Element => {
  const [person, setPerson] = useState(initPerson)
  return (
    <PersonContext.Provider value={[person, setPerson]}>
      {children}
    </PersonContext.Provider>
  )
}
