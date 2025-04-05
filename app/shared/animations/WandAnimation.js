import LottieAnimation from './LottieAnimation'
import * as data from './wand.json'
export default function WandAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
