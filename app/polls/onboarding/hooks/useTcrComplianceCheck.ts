'use client'
import { useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { TCR_COMPLIANCE_STATUS } from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'

interface TcrComplianceResponse {
  status?: string
}

export const useTcrComplianceCheck = (): [boolean, boolean, string | null, () => Promise<void>] => {
  const [tcrCompliant, setTcrCompliant] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTcrCompliance = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await clientFetch<TcrComplianceResponse>(apiRoutes.campaign.tcrCompliance.fetch)
      
      if (!response.ok) {
        throw new Error('Failed to fetch TCR Compliance data')
      }
      
      const tcrCompliance = response.data
      const isCompliant = tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED
      
      setTcrCompliant(isCompliant)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setTcrCompliant(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTcrCompliance()
  }, [])

  return [tcrCompliant, isLoading, error, fetchTcrCompliance]
}

