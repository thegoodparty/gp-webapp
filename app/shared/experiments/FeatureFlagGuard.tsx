'use client'

import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFlagOn } from './FeatureFlagsProvider'

interface FeatureFlagGuardProps {
  flagKey: string
  redirectTo?: string
  children: ReactNode
}

export default function FeatureFlagGuard({
  flagKey,
  redirectTo = '/dashboard',
  children,
}: FeatureFlagGuardProps): React.JSX.Element | null {
  const router = useRouter()
  const { ready: flagsReady, on: flagEnabled } = useFlagOn(flagKey)

  useEffect(() => {
    if (flagsReady && !flagEnabled) {
      router.replace(redirectTo)
    }
  }, [flagsReady, flagEnabled, router, redirectTo])

  if (!flagsReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!flagEnabled) {
    return null
  }

  return children as React.JSX.Element
}
