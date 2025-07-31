'use client'

import LottieAnimation from './LottieAnimation'
import * as data from './loadingMap.json'
export default function LoadingMapAnimation(props) {
  return <LottieAnimation animationData={data} {...props} loop />
}
