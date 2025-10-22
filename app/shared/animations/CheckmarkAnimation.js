'use client'

import LottieAnimation from './LottieAnimation'
import checkmarkData from './checkmark.json'
export default function CheckmarkAnimation(props) {
  return <LottieAnimation animationData={checkmarkData} {...props} />
}
