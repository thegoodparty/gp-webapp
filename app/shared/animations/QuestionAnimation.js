'use client'

import LottieAnimation from './LottieAnimation'
import * as data from './question.json'
export default function QuestionAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
