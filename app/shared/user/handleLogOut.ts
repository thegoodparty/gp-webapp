'use client'

import { useRouter } from 'next/navigation'
import { MouseEvent, useCallback } from 'react'

export const useHandleLogOut = (): ((e?: MouseEvent<HTMLElement>) => void) => {
  const router = useRouter()
  return useCallback(
    (_e?: MouseEvent<HTMLElement>) => {
      router.replace('/logout')
    },
    [router],
  )
}
