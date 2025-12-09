'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface ContactsStatsBucket {
  label: string
  percent: number
}

interface ContactsStatsCategory {
  buckets?: ContactsStatsBucket[]
}

interface ContactsStatsCategories {
  age?: ContactsStatsCategory
  presenceOfChildren?: ContactsStatsCategory
  homeowner?: ContactsStatsCategory
  estimatedIncomeRange?: ContactsStatsCategory
  education?: ContactsStatsCategory
}

interface ContactsStatsMeta {
  totalConstituents?: number
}

interface ContactsStats {
  categories?: ContactsStatsCategories
  meta?: ContactsStatsMeta
}

interface ContactsStatsContextValue {
  contactsStats: ContactsStats | null
  isLoading: boolean
  error: string | null
  refreshContactsStats: () => void
  fetchContactsStats: () => Promise<void>
}

const ContactsStatsContext = createContext<ContactsStatsContextValue | undefined>(undefined)

export const useContactsStats = (): ContactsStatsContextValue => {
  const context = useContext(ContactsStatsContext)
  if (!context) {
    throw new Error(
      'useContactsStats must be used within a ContactsStatsProvider',
    )
  }
  return context
}

interface ContactsStatsProviderProps {
  children: ReactNode
}

export const ContactsStatsProvider = ({ children }: ContactsStatsProviderProps) => {
  const [contactsStats, setContactsStats] = useState<ContactsStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContactsStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await clientFetch<ContactsStats>(apiRoutes.contacts.stats, null, {
        revalidate: 3600,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch contacts stats')
      }

      setContactsStats(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
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

  const value: ContactsStatsContextValue = {
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

