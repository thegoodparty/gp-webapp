'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './question.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface QuestionAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function QuestionAnimation(
  props: QuestionAnimationProps,
): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}
