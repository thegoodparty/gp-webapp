'use client'
import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'

export default function LottieAnimation({
  style = {},
  callback = () => {},
  animationData = {},
  ...restProps
}) {
  const handleEvent = (event) => {
    if (event === PlayerEvent.Complete) {
      callback()
    }
  }
  return (
    <div inert={true}>
      <Player
        loop={false}
        autoplay={true}
        onEvent={handleEvent}
        style={{
          cursor: 'default',
          ...style,
        }}
        src={animationData}
        {...restProps}
      />
    </div>
  )
}
