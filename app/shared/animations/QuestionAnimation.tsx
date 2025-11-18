'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './question.json'

interface QuestionAnimationProps {
  [key: string]: unknown
}

export default function QuestionAnimation(props: QuestionAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}

