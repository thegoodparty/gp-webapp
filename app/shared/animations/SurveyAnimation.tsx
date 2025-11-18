'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './survey.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface SurveyAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function SurveyAnimation(props: SurveyAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}
