'use client'

import LottieAnimation from './LottieAnimation'
import data from './vote.json'
export default function VoteAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
