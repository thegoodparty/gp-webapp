'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './loading-dots.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface LoadingDotsAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function LoadingDotsAnimation(props: LoadingDotsAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} loop {...props} />
}
