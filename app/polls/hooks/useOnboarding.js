'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import {
  personElectDemoMessageText as personElectDemoMessageTextPolls,
  personElectMessageText as personElectMessageTextPolls,
  demoMessageText as demoMessageTextPolls,
  messageText as messageTextPolls,
} from '../onboarding/components/DemoMessageText'
import { format, isBefore } from 'date-fns'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { grammarizeOfficeName } from '../onboarding/utils/grammarizeOfficeName'

export const useOnboarding = () => {
  const [campaign] = useCampaign()
  const [user] = useUser()

  const [formData, setFormData] = useState({
    imageUrl: null,
    textMessage: null,
    scheduledDate: null,
    swornInDate: null,
    swornIn: false,
    scheduledDate: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [stepValidation, setStepValidation] = useState({
    'Sworn In': false,
  })

  // validation for sworn in step
  const swornInDate = formData.swornInDate
  useEffect(() => {
    setStepValidation((prev) => ({
      ...prev,
      'Sworn In': !!swornInDate,
    }))
  }, [swornInDate])

  // Memoize campaign and user data
  const campaignOffice = useMemo(
    () =>
      grammarizeOfficeName(
        campaign?.details?.otherOffice || campaign?.details?.office,
      ),
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
        ? personElectDemoMessageTextPolls({
            name: userName,
            office: campaignOffice,
          })
        : demoMessageTextPolls({
            name: userName,
            office: campaignOffice,
          }),
    [userName, campaignOffice, isSwornIn],
  )
  // Real Message text that is sent to the API
  const messageText = useMemo(
    () =>
      !isSwornIn
        ? personElectMessageTextPolls({
            name: userName,
            office: campaignOffice,
          })
        : messageTextPolls({ name: userName, office: campaignOffice }),
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

  const setSwornInDate = useCallback(
    (swornInDate) => {
      const isSwornIn = isBefore(new Date(), swornInDate) ? false : true
      updateFormData({
        swornInDate,
        swornIn: isSwornIn,
      })
      trackEvent(EVENTS.ServeOnboarding.SwornInCompleted, {
        swornInDate: swornInDate,
        isSwornIn: isSwornIn,
      })
    },
    [updateFormData],
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
      setIsSubmitting(true)
      setSubmitError(null)

      const response = await clientFetch(apiRoutes.polls.initialPoll, {
        message: formData.textMessage,
        imageUrl: formData.imageUrl,
        swornInDate: format(formData.swornInDate, 'yyyy-MM-dd'),
        scheduledDate: formData.scheduledDate,
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
  }, [formData])

  const resetFormData = useCallback(() => {
    setFormData({
      imageUrl: null,
      textMessage: null,
      scheduledDate: null,
      swornInDate: null,
      swornIn: false,
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
    setTextMessage,
    setSwornInDate,
    submitOnboarding,
    resetFormData,

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
