'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import checkmarkData from './checkmark.json'

interface CheckmarkAnimationProps {
  [key: string]: unknown
}

export default function CheckmarkAnimation(props: CheckmarkAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={checkmarkData} {...props} />
}

