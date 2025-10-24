'use client'

import LottieAnimation from './LottieAnimation'
import data from './congratulations.json'

export default function CongratulationsAnimation({ loop = false }) {
  return <LottieAnimation animationData={data} loop={loop} />
}
