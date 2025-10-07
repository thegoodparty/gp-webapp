'use client'
import { createContext, useContext } from 'react'
import { useOnboarding } from '../hooks/useOnboarding'

const OnboardingContext = createContext()

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider')
  }
  return context
}

export const OnboardingProvider = ({ children }) => {
  const onboardingData = useOnboarding()

  return (
    <OnboardingContext.Provider value={onboardingData}>
      {children}
    </OnboardingContext.Provider>
  )
}
