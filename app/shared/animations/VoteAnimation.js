import LottieAnimation from './LottieAnimation'
import * as data from './vote.json'
export default function VoteAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
