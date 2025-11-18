'use client'
import React, { useState, useEffect, CSSProperties, ComponentType } from 'react'

interface LottieAnimationProps {
  style?: CSSProperties
  callback?: () => void
  animationData?: object
  [key: string]: unknown
}

export default function LottieAnimation({
  style = {},
  callback = () => {},
  animationData = {},
  ...restProps
}: LottieAnimationProps): React.JSX.Element {
  const [Player, setPlayer] = useState<ComponentType<any> | null>(null)
  const [PlayerEvent, setPlayerEvent] = useState<any>(null)

  useEffect(() => {
    const loadPlayer = async (): Promise<void> => {
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

  const handleEvent = (event: any): void => {
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
