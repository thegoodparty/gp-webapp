'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { DemoMessageText, MessageText } from '../onboarding/components/DemoMessageText'
import { useContactsSample } from './useContactsSample'
import { useCsvUpload } from './useCsvUpload'

export const useOnboarding = () => {
  const [campaign] = useCampaign()
  const [user] = useUser()
  const { contactsSample, isLoadingContactsSample, contactsSampleError } = useContactsSample()
  
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
  
  const userName = useMemo(() => user?.firstName + ' ' + user?.lastName, [user])
  
  // Demo message text is used for the preview step and strategy step (It includes a constituency name for demo purposes)
  const demoMessageText = useMemo(() => 
    DemoMessageText({ name: userName, office: campaignOffice, constituentName: 'Bill' }),
    [userName, campaignOffice]
  )
  // Real Message text that is sent to the API
  const messageText = useMemo(() => 
    MessageText({ name: userName, office: campaignOffice }),
    [userName, campaignOffice]
  )

  // Automatically set the text message when demo text is available
  useEffect(() => {
    if (messageText) {
      setFormData(prev => ({
        ...prev,
        textMessage: messageText
      }))
    }
  }, [messageText])

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

  // Handle CSV upload when contacts sample is available
  const { isUploadingCsvSample, csvSampleError } = useCsvUpload(
    contactsSample, 
    campaign, 
    formData.csvUrl, 
    setCsvUrl
  )

  const setTextMessage = useCallback((textMessage) => {
    updateFormData({
      textMessage
    })
  }, [updateFormData])

  const submitOnboarding = useCallback(async () => {
    try {
      // Check if contacts sample is still loading
      if (isLoadingContactsSample) {
        throw new Error('Contact data is still loading.')
      }
      if (isUploadingCsvSample) {
        throw new Error('Contact data is still being prepared.')
      }
      if (contactsSampleError) {
        throw new Error('Failed to load contact data.')
      }
      if (csvSampleError) {
        throw new Error('Failed to prepare contact data.')
      }
      if (!formData.csvUrl) {
        throw new Error('Contact data is not ready.')
      }
      
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
  }, [formData, csvSampleError, isLoadingContactsSample, isUploadingCsvSample, contactsSampleError])

  const resetFormData = useCallback(() => {
    setFormData({ imageUrl: null, csvUrl: null, textMessage: null })
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
    
    // Contacts sample
    contactsSample,
    isLoadingContactsSample,
    contactsSampleError,
    isUploadingCsvSample,
    csvSampleError,
    
    // Campaign and user data
    campaign,
    user,
    campaignOffice,
    userName,
    demoMessageText
  }
}
