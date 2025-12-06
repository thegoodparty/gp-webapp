'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export const usePageExit = (callback: (isWindowClose: boolean) => void) => {
  const pathname = usePathname()
  const isUnloading = useRef(false)
  const isInitialMount = useRef(true)

  useEffect(() => {
    const handleBeforeUnload = () => {
      isUnloading.current = true
      callback(true)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)

      if (isInitialMount.current) {
        isInitialMount.current = false
        return
      }

      if (!isUnloading.current) {
        callback(false)
      }

      isUnloading.current = false
    }
  }, [callback, pathname])
}




