'use client'

import LottieAnimation from './LottieAnimation'
import animationData from './party.json'
export default function PartyAnimation() {
  return <LottieAnimation animationData={animationData} loop />
}
