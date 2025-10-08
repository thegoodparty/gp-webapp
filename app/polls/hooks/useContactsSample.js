'use client'
import { useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const useContactsSample = () => {
  const [contactsSample, setContactsSample] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchContactsSample = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await clientFetch(apiRoutes.contacts.sample)
        
        if (!response.ok) {
          throw new Error(response.statusText || 'Failed to fetch contacts sample')
        }
        
        if (isMounted) {
          setContactsSample(response.data)
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setError('Unable to load sample contacts right now')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchContactsSample()
    
    return () => {
      isMounted = false
    }
  }, [])

  return {
    contactsSample,
    isLoadingContactsSample: isLoading,
    contactsSampleError: error
  }
}
