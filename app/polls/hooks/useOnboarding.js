'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import {
  DemoMessageText,
  MessageText,
  PersonElectDemoMessageText,
  PersonElectMessageText,
} from '../onboarding/components/DemoMessageText'
import { useContactsSample } from './useContactsSample'
import { useCsvUpload } from './useCsvUpload'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { isBefore } from 'date-fns'

export const useOnboarding = () => {
  const { on: pollsAccessEnabled } = useFlagOn('serve-polls-v1')
  const [campaign] = useCampaign()
  const [user] = useUser()
  const { contactsSample, isLoadingContactsSample, contactsSampleError } =
    useContactsSample()

  const [formData, setFormData] = useState({
    imageUrl: null,
    csvUrl: null,
    textMessage: null,
    scheduledDate: null,
    estimatedCompletionDate: null,
    swornInDate: null,
    swornIn: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [stepValidation, setStepValidation] = useState({
    'Sworn In': false,
  })

  // In useOnboarding hook
  const swornInDate = formData.swornInDate
  useEffect(() => {
    setStepValidation((prev) => ({
      ...prev,
      'Sworn In': !!swornInDate,
    }))
  }, [swornInDate])

  // Memoize campaign and user data
  const campaignOffice = useMemo(
    () => campaign?.details?.otherOffice || campaign?.details?.office,
    [campaign],
  )
  const userName = useMemo(() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    // Extra fallback. This should not happen.
    return user?.name || `n/a`
  }, [user])

  const isSwornIn = formData.swornIn
  // Demo message text is used for the preview step and strategy step (It includes a constituency name for demo purposes)
  const demoMessageText = useMemo(
    () =>
      !isSwornIn
        ? PersonElectDemoMessageText({
            name: userName,
            office: campaignOffice,
          })
        : DemoMessageText({
            name: userName,
            office: campaignOffice,
          }),
    [userName, campaignOffice, isSwornIn],
  )
  // Real Message text that is sent to the API
  const messageText = useMemo(
    () =>
      !isSwornIn
        ? PersonElectMessageText({ name: userName, office: campaignOffice })
        : MessageText({ name: userName, office: campaignOffice }),
    [userName, campaignOffice, isSwornIn],
  )

  // Automatically set the text message when demo text is available
  useEffect(() => {
    if (messageText) {
      setFormData((prev) => ({
        ...prev,
        textMessage: messageText,
      }))
    }
  }, [messageText])

  // Calculate and set the scheduled and completion dates
  useEffect(() => {
    const now = new Date()
    // These are placeholder values, will be expanded upon in the future. We are forcing 7 days for tevyn in interim.
    const scheduledDate = new Date(now)
    scheduledDate.setDate(now.getDate() + 4) // 4 days from now

    const estimatedCompletionDate = new Date(now)
    estimatedCompletionDate.setDate(now.getDate() + 7) // 7 days from now (4 + 3), 3 day processing time

    setFormData((prev) => ({
      ...prev,
      scheduledDate,
      estimatedCompletionDate,
    }))
  }, [])

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  const setImageUrl = useCallback(
    (imageUrl) => {
      updateFormData({ imageUrl })
    },
    [updateFormData],
  )

  const setCsvUrl = useCallback(
    (csvUrl) => {
      updateFormData({ csvUrl })
    },
    [updateFormData],
  )

  const setSwornInDate = useCallback(
    (swornInDate) => {
      updateFormData({
        swornInDate,
        swornIn: isBefore(new Date(), swornInDate) ? false : true,
      })
    },
    [updateFormData],
  )

  // Handle CSV upload when contacts sample is available
  const { isUploadingCsvSample, csvSampleError } = useCsvUpload(
    contactsSample,
    campaign,
    formData.csvUrl,
    setCsvUrl,
  )

  const setTextMessage = useCallback(
    (textMessage) => {
      updateFormData({
        textMessage,
      })
    },
    [updateFormData],
  )

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

      const response = await clientFetch(apiRoutes.polls.initialPoll, {
        message: formData.textMessage,
        csvFileUrl: formData.csvUrl,
        imageUrl: formData.imageUrl,
        swornInDate: formData.swornInDate,
        createPoll: pollsAccessEnabled,
      })

      if (!response.ok) {
        throw new Error(
          'Failed to submit onboarding data',
          response.statusText,
          response.data,
        )
      }

      return response.data
    } catch (error) {
      console.error(error)
      setSubmitError(
        'Try again in a few minutes or contact us if the issue persists',
      )
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [
    formData,
    csvSampleError,
    isLoadingContactsSample,
    isUploadingCsvSample,
    contactsSampleError,
    pollsAccessEnabled,
  ])

  const resetFormData = useCallback(() => {
    setFormData({
      imageUrl: null,
      csvUrl: null,
      textMessage: null,
      scheduledDate: null,
      estimatedCompletionDate: null,
      swornInDate: null,
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
    setSwornInDate,
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
    demoMessageText,

    // Step validation
    stepValidation,
    setStepValidation,
  }
}
