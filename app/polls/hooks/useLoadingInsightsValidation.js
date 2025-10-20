'use client'
import { useMemo } from 'react'
import { useContactsStats } from '../contexts/ContactsStatsContext'
import { useOnboardingContext } from '../contexts/OnboardingContext'
import { useContactsSample } from './useContactsSample'

export const useLoadingInsightsValidation = () => {
  const {
    contactsStats,
    isLoading: isLoadingContactsStats,
    error: contactsStatsError,
  } = useContactsStats()
  const { campaign } = useOnboardingContext()
  const { contactsSample, isLoadingContactsSample, contactsSampleError } =
    useContactsSample()

  const validation = useMemo(() => {
    const errors = []
    const isLoading = isLoadingContactsStats || isLoadingContactsSample

    // Check for contactsStats error
    if (contactsStatsError) {
      errors.push({
        type: 'contactsStats',
        message: 'Failed to load contact statistics. Please try again.',
        error: contactsStatsError,
      })
    }

    // Check for contactsSample error
    if (contactsSampleError) {
      errors.push({
        type: 'contactsSample',
        message: 'Failed to load contact sample data. Please try again.',
        error: contactsSampleError,
      })
    }

    // Check for missing p2v data. This is a hacky check, but it's the best we can do for now.
    if (campaign?.pathToVictory?.data?.electionLocation.includes('#')) {
      errors.push({
        type: 'electionLocation',
        message:
          'Election location is not configured. Please complete your campaign setup.',
        error: 'electionLocation includes #',
      })
    }

    return {
      errors,
      hasErrors: errors.length > 0,
      isLoading,
      // Individual error flags for specific handling
      hasContactsStatsError: !!contactsStatsError,
      hasContactsSampleError: !!contactsSampleError,
      hasElectionLocationError:
        campaign?.pathToVictory?.data?.electionLocation === null,
    }
  }, [
    contactsStatsError,
    contactsSampleError,
    campaign?.pathToVictory?.data?.electionLocation,
    isLoadingContactsStats,
    isLoadingContactsSample,
  ])

  return validation
}
