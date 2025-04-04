import LottieAnimation from './LottieAnimation'
import * as checkmarkData from './checkmark.json'
export default function CheckmarkAnimation(props) {
  return <LottieAnimation animationData={checkmarkData} {...props} />
}
