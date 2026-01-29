'use client'
import { useState, useEffect } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Tailwind v4 breakpoint values (matches @theme in globals.css)
 * These are standard Tailwind defaults and rarely change
 */
const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 400,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const useTailwindBreakpoints = (): Breakpoint => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm')

  useEffect(() => {
    const getCurrentBreakpoint = (): void => {
      const width = window.innerWidth
      
      if (width >= BREAKPOINTS['2xl']) {
        setCurrentBreakpoint('2xl')
      } else if (width >= BREAKPOINTS.xl) {
        setCurrentBreakpoint('xl')
      } else if (width >= BREAKPOINTS.lg) {
        setCurrentBreakpoint('lg')
      } else if (width >= BREAKPOINTS.md) {
        setCurrentBreakpoint('md')
      } else if (width >= BREAKPOINTS.sm) {
        setCurrentBreakpoint('sm')
      } else {
        setCurrentBreakpoint('xs')
      }
    }

    getCurrentBreakpoint()
    window.addEventListener('resize', getCurrentBreakpoint)
    return () => window.removeEventListener('resize', getCurrentBreakpoint)
  }, [])

  return currentBreakpoint
}

