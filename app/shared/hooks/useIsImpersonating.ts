'use client'
import { useAuth } from '@clerk/nextjs'

export const useIsImpersonating = (): boolean => {
  const { actor } = useAuth()
  return !!actor
}
