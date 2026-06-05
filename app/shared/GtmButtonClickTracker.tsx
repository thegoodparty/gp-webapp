'use client'
import { useEffect } from 'react'

export const GtmButtonClickTracker = (): null => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      const button = target?.closest('button[data-slot="button"]')
      if (button instanceof HTMLButtonElement && button.id) {
        const w = window as Window & {
          dataLayer?: Array<Record<string, unknown>>
        }
        w.dataLayer?.push({ event: 'buttonClick', formId: button.id })
      }
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])
  return null
}
