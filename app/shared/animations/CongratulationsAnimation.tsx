'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './congratulations.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface CongratulationsAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function CongratulationsAnimation({
  loop = false,
  ...restProps
}: CongratulationsAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} loop={loop} {...restProps} />
}
