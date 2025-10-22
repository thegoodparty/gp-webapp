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
      try {
        const { Player: LottiePlayer, PlayerEvent: LottiePlayerEvent } =
          await import('@lottiefiles/react-lottie-player')
        setPlayer(() => LottiePlayer)
        setPlayerEvent(LottiePlayerEvent)
      } catch (error) {
        console.warn('Failed to load Lottie player:', error)
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
