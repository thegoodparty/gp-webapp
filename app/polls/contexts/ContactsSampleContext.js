'use client'
import { createContext, useContext } from 'react'
import { useContactsSample } from '../hooks/useContactsSample'

const ContactsSampleContext = createContext()

export const useContactsSampleContext = () => {
  const context = useContext(ContactsSampleContext)
  if (!context) {
    throw new Error('useContactsSampleContext must be used within a ContactsSampleProvider')
  }
  return context
}

export const ContactsSampleProvider = ({ children }) => {
  const contactsSampleData = useContactsSample()

  return (
    <ContactsSampleContext.Provider value={contactsSampleData}>
      {children}
    </ContactsSampleContext.Provider>
  )
}
