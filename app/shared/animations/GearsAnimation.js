import LottieAnimation from './LottieAnimation'
import * as animationData from 'app/shared/animations/gears.json'
export default function GearsAnimation(props) {
  return (
    <LottieAnimation
      style={{
        marginTop: '-100px',
        marginBottom: '-100px',
      }}
      animationData={animationData}
      {...props}
    />
  )
}
