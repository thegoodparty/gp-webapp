'use client'
import { useContext } from 'react'
import { AcademySignUpModalContext } from './AcademySignUpModalProvider'

export const useAcademySignUpModalState = () => {
  const context = useContext(AcademySignUpModalContext)
  if (!context) {
    throw new Error(
      'useAcademySignUpModalState must be used within AcademySignUpModalProvider',
    )
  }
  return context
}
