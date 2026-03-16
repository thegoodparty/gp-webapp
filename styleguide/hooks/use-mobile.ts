'use client'

import { useTailwindBreakpoints } from '@shared/hooks/useTailwindBreakpoints'

export const useIsMobile = () => {
  const breakpoint = useTailwindBreakpoints()
  return breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md'
}
