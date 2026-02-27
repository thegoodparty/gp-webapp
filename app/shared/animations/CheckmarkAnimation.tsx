'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import checkmarkData from './checkmark.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface CheckmarkAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function CheckmarkAnimation(
  props: CheckmarkAnimationProps,
): React.JSX.Element {
  return <LottieAnimation animationData={checkmarkData} {...props} />
}
