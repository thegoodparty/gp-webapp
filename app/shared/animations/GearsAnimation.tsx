'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import animationData from 'app/shared/animations/gears.json'

interface GearsAnimationProps {
  [key: string]: unknown
}

export default function GearsAnimation(props: GearsAnimationProps): React.JSX.Element {
  return (
    <LottieAnimation
      style={{
        marginTop: '-100px',
        marginBottom: '-100px',
      }}
      animationData={animationData}
      {...props}
    />
  )
}

