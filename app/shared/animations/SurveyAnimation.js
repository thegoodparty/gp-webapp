'use client';

import LottieAnimation from './LottieAnimation';
import * as data from './survey.json';
export default function SurveyAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />;
}
