'use client'

import LottieAnimation from './LottieAnimation'
import * as animationData from './party.json'
export default function PartyAnimation() {
  return <LottieAnimation animationData={animationData} loop />
}
