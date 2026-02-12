'use client'
import { useState, useEffect } from 'react'
import type { ComponentType } from 'react'
import type {
  IPlayerProps,
  PlayerEvent as PlayerEventType,
} from '@lottiefiles/react-lottie-player'

interface LottieAnimationProps extends Omit<IPlayerProps, 'src'> {
  animationData?: object | string
  callback?: () => void
}

export default function LottieAnimation({
  style = {},
  callback = () => {},
  animationData = {},
  ...restProps
}: LottieAnimationProps) {
  const [Player, setPlayer] = useState<ComponentType<IPlayerProps> | null>(null)
  const [PlayerEvent, setPlayerEvent] = useState<typeof PlayerEventType | null>(
    null,
  )

  useEffect(() => {
    const loadPlayer = async (): Promise<void> => {
      try {
        const { Player: LottiePlayer, PlayerEvent: LottiePlayerEvent } =
          await import('@lottiefiles/react-lottie-player')
        setPlayer(() => LottiePlayer as ComponentType<IPlayerProps>)
        setPlayerEvent(LottiePlayerEvent)
      } catch (error) {
        console.warn('Failed to load Lottie player:', error)
      }
    }

    loadPlayer()
  }, [])

  const handleEvent = (event: PlayerEventType): void => {
    if (PlayerEvent && event === PlayerEvent.Complete) {
      callback()
    }
  }

  if (!Player) {
    return <div style={{ ...style, minHeight: '100px' }} />
  }

  return (
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
  )
}
