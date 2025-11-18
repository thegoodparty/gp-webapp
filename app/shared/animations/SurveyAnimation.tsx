'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './survey.json'

interface SurveyAnimationProps {
  [key: string]: unknown
}

export default function SurveyAnimation(props: SurveyAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}

