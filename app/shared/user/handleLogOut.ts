'use client'

import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import { useRouter } from 'next/navigation'
import { MouseEvent, useCallback } from 'react'

export const useHandleLogOut = (): ((e?: MouseEvent<HTMLElement>) => void) => {
  const router = useRouter()
  return useCallback(
    (e?: MouseEvent<HTMLElement>) => {
      e?.currentTarget && fireGTMButtonClickEvent(e.currentTarget)
      router.replace('/logout')
    },
    [router],
  )
}
