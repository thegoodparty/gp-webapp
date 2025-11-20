'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const ContactsStatsContext = createContext()

export const useContactsStats = () => {
  const context = useContext(ContactsStatsContext)
  if (!context) {
    throw new Error(
      'useContactsStats must be used within a ContactsStatsProvider',
    )
  }
  return context
}

export const ContactsStatsProvider = ({ children }) => {
  const [contactsStats, setContactsStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContactsStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await clientFetch(apiRoutes.contacts.stats, null, {
        revalidate: 3600,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch contacts stats')
      }

      setContactsStats(response.data)
    } catch (err) {
      setError(err.message)
      setContactsStats(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshContactsStats = () => {
    fetchContactsStats()
  }

  useEffect(() => {
    fetchContactsStats()
  }, [])

  const value = {
    contactsStats,
    isLoading,
    error,
    refreshContactsStats,
    fetchContactsStats,
  }

  return (
    <ContactsStatsContext.Provider value={value}>
      {children}
    </ContactsStatsContext.Provider>
  )
}
