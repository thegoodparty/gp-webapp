'use client'
import React from 'react'
import LottieAnimation from './LottieAnimation'
import data from './party.json'

interface PartyAnimationProps {
  [key: string]: unknown
}

export default function PartyAnimation(props: PartyAnimationProps): React.JSX.Element {
  return <LottieAnimation animationData={data} {...props} />
}

