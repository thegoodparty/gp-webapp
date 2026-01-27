'use client'
import { useState, useEffect } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)
const breakpoints = fullConfig.theme.screens as Record<string, string>

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const useTailwindBreakpoints = (): Breakpoint => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm')

  useEffect(() => {
    const getCurrentBreakpoint = (): void => {
      if (typeof window === 'undefined') {
        return
      }

      const width = window.innerWidth
      
      if (breakpoints['2xl'] && width >= parseInt(breakpoints['2xl'])) {
        setCurrentBreakpoint('2xl')
      } else if (breakpoints.xl && width >= parseInt(breakpoints.xl)) {
        setCurrentBreakpoint('xl')
      } else if (breakpoints.lg && width >= parseInt(breakpoints.lg)) {
        setCurrentBreakpoint('lg')
      } else if (breakpoints.md && width >= parseInt(breakpoints.md)) {
        setCurrentBreakpoint('md')
      } else if (breakpoints.sm && width >= parseInt(breakpoints.sm)) {
        setCurrentBreakpoint('sm')
      } else {
        setCurrentBreakpoint('xs')
      }
    }

    getCurrentBreakpoint()

    window.addEventListener('resize', getCurrentBreakpoint)

    return (): void => window.removeEventListener('resize', getCurrentBreakpoint)
  }, [])

  return currentBreakpoint
}

