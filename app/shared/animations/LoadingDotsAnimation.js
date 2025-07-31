'use client'

import LottieAnimation from './LottieAnimation'
import * as data from './loading-dots.json'
export default function LoadingDotsAnimation(props) {
  return <LottieAnimation animationData={data} loop {...props} />
}
