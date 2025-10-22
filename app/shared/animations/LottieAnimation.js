'use client'
import { useState, useEffect } from 'react'

export default function LottieAnimation({
  style = {},
  callback = () => {},
  animationData = {},
  ...restProps
}) {
  const [Player, setPlayer] = useState(null)
  const [PlayerEvent, setPlayerEvent] = useState(null)

  useEffect(() => {
    const loadPlayer = async () => {
      console.log('Loading Lottie player')
      try {
        const { Player: LottiePlayer, PlayerEvent: LottiePlayerEvent } =
          await import('@lottiefiles/react-lottie-player')
        console.log('Lottie player loaded')
        console.log('Lottie player event loaded')
        setPlayer(() => LottiePlayer)
        setPlayerEvent(LottiePlayerEvent)
        console.log('Player and PlayerEvent set')
      } catch (error) {
        console.warn('Failed to load Lottie player:', error)
        console.log('Error:', error)
      }
    }

    loadPlayer()
  }, [])

  const handleEvent = (event) => {
    if (PlayerEvent && event === PlayerEvent.Complete) {
      callback()
    }
  }

  if (!Player) {
    return <div style={{ ...style, minHeight: '100px' }} />
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
