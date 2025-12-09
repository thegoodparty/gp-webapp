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

interface FormData {
  imageUrl: string | null
  textMessage: string | null
  scheduledDate: Date | null
  estimatedCompletionDate: Date | null
  swornInDate: Date | null
  swornIn: boolean
}

interface StepValidation {
  [key: string]: boolean
}

export interface UseOnboardingReturn {
  formData: FormData
  isSubmitting: boolean
  submitError: string | null
  updateFormData: (updates: Partial<FormData>) => void
  setImageUrl: (imageUrl: string | null) => void
  setTextMessage: (textMessage: string) => void
  setSwornInDate: (swornInDate: Date) => void
  submitOnboarding: () => Promise<unknown>
  resetFormData: () => void
  campaign: ReturnType<typeof useCampaign>[0]
  user: ReturnType<typeof useUser>[0]
  campaignOffice: string | null | undefined
  userName: string
  demoMessageText: string
  stepValidation: StepValidation
}

export const useOnboarding = (): UseOnboardingReturn => {
  const [campaign] = useCampaign()
  const [user] = useUser()

  const [formData, setFormData] = useState<FormData>({
    imageUrl: null,
    textMessage: null,
    scheduledDate: null,
    estimatedCompletionDate: null,
    swornInDate: null,
    swornIn: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [stepValidation, setStepValidation] = useState<StepValidation>({
    'Sworn In': false,
  })

  const swornInDate = formData.swornInDate
  useEffect(() => {
    setStepValidation((prev) => ({
      ...prev,
      'Sworn In': !!swornInDate,
    }))
  }, [swornInDate])

  const campaignOffice = useMemo(
    () =>
      grammarizeOfficeName(
        campaign?.details?.otherOffice || campaign?.details?.office || '',
      ),
    [campaign],
  )
  const userName = useMemo(() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.name || `n/a`
  }, [user])

  const isSwornIn = formData.swornIn
  const demoMessageText = useMemo(
    () =>
      !isSwornIn
        ? personElectDemoMessageTextPolls({
            name: userName,
            office: campaignOffice || '',
          })
        : demoMessageTextPolls({
            name: userName,
            office: campaignOffice || '',
          }),
    [userName, campaignOffice, isSwornIn],
  )
  const messageText = useMemo(
    () =>
      !isSwornIn
        ? personElectMessageTextPolls({
            name: userName,
            office: campaignOffice || '',
          })
        : messageTextPolls({ name: userName, office: campaignOffice || '' }),
    [userName, campaignOffice, isSwornIn],
  )

  useEffect(() => {
    if (messageText) {
      setFormData((prev) => ({
        ...prev,
        textMessage: messageText,
      }))
    }
  }, [messageText])

  useEffect(() => {
    const now = new Date()
    const scheduledDate = new Date(now)
    scheduledDate.setDate(now.getDate() + 4)

    const estimatedCompletionDate = new Date(now)
    estimatedCompletionDate.setDate(now.getDate() + 7)

    setFormData((prev) => ({
      ...prev,
      scheduledDate,
      estimatedCompletionDate,
    }))
  }, [])

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  const setImageUrl = useCallback(
    (imageUrl: string | null) => {
      updateFormData({ imageUrl })
    },
    [updateFormData],
  )

  const setSwornInDate = useCallback(
    (swornInDate: Date) => {
      const isSwornIn = isBefore(new Date(), swornInDate) ? false : true
      updateFormData({
        swornInDate,
        swornIn: isSwornIn,
      })
      trackEvent(EVENTS.ServeOnboarding.SwornInCompleted, {
        swornInDate: swornInDate.toISOString(),
        isSwornIn: isSwornIn,
      })
    },
    [updateFormData],
  )

  const setTextMessage = useCallback(
    (textMessage: string) => {
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

      if (!formData.textMessage || !formData.swornInDate) {
        throw new Error('Missing required fields')
      }

      const response = await clientFetch<unknown>(apiRoutes.polls.initialPoll, {
        message: formData.textMessage,
        imageUrl: formData.imageUrl,
        swornInDate: format(formData.swornInDate, 'yyyy-MM-dd'),
      })

      if (!response.ok) {
        throw new Error('Failed to submit onboarding data')
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
      estimatedCompletionDate: null,
      swornInDate: null,
      swornIn: false,
    })
    setSubmitError(null)
  }, [])

  return {
    formData,
    isSubmitting,
    submitError,
    updateFormData,
    setImageUrl,
    setTextMessage,
    setSwornInDate,
    submitOnboarding,
    resetFormData,
    campaign,
    user,
    campaignOffice,
    userName,
    demoMessageText,
    stepValidation,
  }
}
