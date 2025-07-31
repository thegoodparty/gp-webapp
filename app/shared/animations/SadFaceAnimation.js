'use client'

import LottieAnimation from './LottieAnimation'
import * as animationData from './sadFace.json'
export default function SadFaceAnimation() {
  return (
    <LottieAnimation className="max-w-1" animationData={animationData} loop />
  )
}
