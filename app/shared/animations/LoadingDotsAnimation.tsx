'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './loading-dots.json'

interface LoadingDotsAnimationProps {
  [key: string]: unknown
}

export default function LoadingDotsAnimation(props: LoadingDotsAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}

