'use client'

import LottieAnimation from './LottieAnimation'
import data from './wand.json'
export default function WandAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
