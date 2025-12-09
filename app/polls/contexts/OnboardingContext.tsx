'use client'
import { createContext, useContext, ReactNode } from 'react'
import { useOnboarding, UseOnboardingReturn } from '../hooks/useOnboarding'

const OnboardingContext = createContext<UseOnboardingReturn | undefined>(undefined)

export const useOnboardingContext = (): UseOnboardingReturn => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const onboardingData = useOnboarding()

  return (
    <OnboardingContext.Provider value={onboardingData}>
      {children}
    </OnboardingContext.Provider>
  )
}

