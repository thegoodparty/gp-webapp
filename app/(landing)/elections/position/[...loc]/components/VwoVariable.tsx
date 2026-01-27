'use client'

import { useEffect } from 'react'

interface VwoVariableProps {
  race: {
    normalizedPositionName?: string
  }
}

declare global {
  interface Window {
    positionName: string
  }
}

export default function VwoVariable({ race }: VwoVariableProps): null {
  const { normalizedPositionName = '' } = race
  useEffect(() => {
    window.positionName = normalizedPositionName
  }, [normalizedPositionName])
  return null
}
