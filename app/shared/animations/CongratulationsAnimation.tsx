'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './congratulations.json'

interface CongratulationsAnimationProps {
  loop?: boolean
}

export default function CongratulationsAnimation({ loop = false }: CongratulationsAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} loop={loop} />
}

