'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './wand.json'

interface WandAnimationProps {
  [key: string]: unknown
}

export default function WandAnimation(props: WandAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}

