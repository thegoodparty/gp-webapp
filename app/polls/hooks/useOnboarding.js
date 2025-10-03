'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { DemoMessageText } from '../onboarding/components/DemoMessageText'

export const useOnboarding = () => {
  const [campaign] = useCampaign()
  const [user] = useUser()
  
  const [formData, setFormData] = useState({
    imageUrl: null,
    csvUrl: null,
    textMessage: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Memoize campaign and user data
  const campaignOffice = useMemo(() => 
    campaign?.details?.otherOffice || campaign?.details?.office, 
    [campaign]
  )
  
  const userName = useMemo(() => user?.name, [user])
  
  const demoMessageText = useMemo(() => 
    DemoMessageText({ name: userName, office: campaignOffice, constituentName: 'Bill' }),
    [userName, campaignOffice]
  )

  // Automatically set the text message when demo text is available
  useEffect(() => {
    if (demoMessageText) {
      setFormData(prev => ({
        ...prev,
        textMessage: demoMessageText
      }))
    }
  }, [demoMessageText])

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  const setImageUrl = useCallback((imageUrl) => {
    updateFormData({imageUrl})
  }, [updateFormData])

  const setCsvUrl = useCallback((csvUrl) => {
    updateFormData({csvUrl})
  }, [updateFormData])

  const setTextMessage = useCallback((textMessage) => {
    updateFormData({
      textMessage
    })
  }, [updateFormData])

  const submitOnboarding = useCallback(async () => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const response = await clientFetch(apiRoutes.contacts.tevynApi, {
        message: formData.textMessage,
        csvFileUrl: formData.csvUrl,
        imageUrl: formData.imageUrl,
      })

      if (!response.ok) {
        throw new Error('Failed to submit onboarding data', response.statusText, response.data)
      }

      return response.data
    } catch (error) {
      console.error(error)
      setSubmitError("Try again in a few minutes or contact us if the issue persists")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  const resetFormData = useCallback(() => {
    setFormData({
      imageUrl: null,
      csvUrl: null,
      textMessage: null,
    })
    setSubmitError(null)
  }, [])

  return {
    // Form data
    formData,
    isSubmitting,
    submitError,
    updateFormData,
    setImageUrl,
    setCsvUrl,
    setTextMessage,
    submitOnboarding,
    resetFormData,
    
    // Campaign and user data
    campaign,
    user,
    campaignOffice,
    userName,
    demoMessageText
  }
}
