'use client'

import { useEffect } from 'react'

export default function VwoVariable({ race }) {
  const { normalizedPositionName } = race
  useEffect(() => {
    window.positionName = normalizedPositionName
  }, [normalizedPositionName])
  return null
}
