'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import animationData from 'app/shared/animations/gears.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface GearsAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
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
