import LottieAnimation from './LottieAnimation'
import * as data from './checklist.json'
export default function ChecklistAnimation(props) {
  return <LottieAnimation animationData={data} {...props} />
}
