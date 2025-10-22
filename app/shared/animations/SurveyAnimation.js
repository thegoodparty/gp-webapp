'use client'

import LottieAnimation from './LottieAnimation'
import data from './survey.json'
export default function SurveyAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
