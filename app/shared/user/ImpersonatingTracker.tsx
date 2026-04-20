'use client'

import { useEffect } from 'react'
import { useIsImpersonating } from '@shared/hooks/useIsImpersonating'
import { setImpersonating } from 'helpers/analyticsHelper'

export function ImpersonatingTracker() {
  const isImpersonating = useIsImpersonating()
  useEffect(() => {
    setImpersonating(isImpersonating)
  }, [isImpersonating])
  return null
}
