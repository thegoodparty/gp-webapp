'use client'
import { createContext, useEffect, useState, useCallback } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useUser } from '@shared/hooks/useUser'

export const ElectedOfficeContext = createContext([null, () => {}])

export const ElectedOfficeProvider = ({
  children,
  electedOffice: initElectedOffice,
}) => {
  const [electedOffice, setElectedOffice] = useState(initElectedOffice)
  const [user] = useUser()

  const fetchUserElectedOffice = useCallback(async () => {
    try {
      const response = await clientFetch(apiRoutes.electedOffice.current)
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
