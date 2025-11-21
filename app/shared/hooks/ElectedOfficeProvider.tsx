'use client'
import { createContext, useEffect, useState, useCallback } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useUser } from '@shared/hooks/useUser'

interface ElectedOffice {
  id: string
  electedDate?: Date | string | null
  swornInDate?: Date | string | null
  termStartDate?: Date | string | null
  termLengthDays?: number | null
  termEndDate?: Date | string | null
  isActive: boolean
  userId: number
  createdAt: Date | string
  updatedAt: Date | string
  campaignId: number
}

type ElectedOfficeContextValue = [
  electedOffice: ElectedOffice | null,
  setElectedOffice: (office: ElectedOffice | null) => void,
  refreshElectedOffice: () => Promise<void>
]

export const ElectedOfficeContext = createContext<ElectedOfficeContextValue>([null, () => {}, async () => {}])

interface ElectedOfficeProviderProps {
  children: React.ReactNode
  electedOffice?: ElectedOffice | null
}

export const ElectedOfficeProvider = ({
  children,
  electedOffice: initElectedOffice,
}: ElectedOfficeProviderProps): React.JSX.Element => {
  const [electedOffice, setElectedOffice] = useState<ElectedOffice | null>(initElectedOffice || null)
  const [user] = useUser()

  const fetchUserElectedOffice = useCallback(async () => {
    try {
      const response = await clientFetch<ElectedOffice>(apiRoutes.electedOffice.current)
      if (response.ok && response.data) {
        setElectedOffice(response.data)
      } else {
        setElectedOffice(null)
      }
    } catch (error) {
      console.error('Failed to fetch elected office:', error)
      setElectedOffice(null)
    }
  }, [])

  const refreshElectedOffice = useCallback(async () => {
    await fetchUserElectedOffice()
  }, [fetchUserElectedOffice])

  useEffect(() => {
    if (user) {
      fetchUserElectedOffice()
    }
  }, [user, fetchUserElectedOffice])

  return (
    <ElectedOfficeContext.Provider
      value={[electedOffice, setElectedOffice, refreshElectedOffice]}
    >
      {children}
    </ElectedOfficeContext.Provider>
  )
}

