'use client'
import { useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { TCR_COMPLIANCE_STATUS } from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'

export const useTcrComplianceCheck = () => {
  const [tcrCompliant, setTcrCompliant] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTcrCompliance = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await clientFetch(apiRoutes.campaign.tcrCompliance.fetch)
      
      if (!response.ok) {
        throw new Error('Failed to fetch TCR Compliance data')
      }
      
      const tcrCompliance = response.data
      const isCompliant = tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED
      
      setTcrCompliant(isCompliant)
    } catch (err) {
      setError(err.message)
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