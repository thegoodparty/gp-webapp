'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './party.json'
import type { IPlayerProps } from '@lottiefiles/react-lottie-player'

interface PartyAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function PartyAnimation(props: PartyAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} loop {...props} />
}
