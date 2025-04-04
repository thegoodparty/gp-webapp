'use client'
import Lottie from 'react-lottie-player'

export default function LottieAnimation({
  style = {},
  callback = () => {},
  ...restProps
}) {
  return (
    // NOTE: inert needs a string value here or React throws an error (Fixed in React 19)
    <div inert="true">
      <Lottie
        loop={false}
        play={true}
        onComplete={callback}
        style={{
          cursor: 'default',
          ...style,
        }}
        {...restProps}
      />
    </div>
  )
}
