import LottieAnimation from './LottieAnimation'
import * as data from './blocked.json'
export default function BlockedAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
