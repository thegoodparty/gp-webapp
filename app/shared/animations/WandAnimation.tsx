'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './wand.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface WandAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function WandAnimation(props: WandAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}
