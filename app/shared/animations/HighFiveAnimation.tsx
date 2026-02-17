'use client'
import { useState, useEffect } from 'react'
import type { ComponentType } from 'react'
import data from './highFive.json'
import type {
  IPlayerProps,
  PlayerEvent as PlayerEventType,
} from '@lottiefiles/react-lottie-player'

interface HighFiveAnimationProps extends Omit<IPlayerProps, 'src'> {
  callback?: () => void
}

export default function HighFiveAnimation({
  loop = false,
  style = {},
  className = 'absolute bottom-0',
  callback = () => {},
  ...restProps
}: HighFiveAnimationProps): React.JSX.Element | null {
  const [animationKey, setAnimationKey] = useState<number>(0)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [Player, setPlayer] = useState<ComponentType<IPlayerProps> | null>(null)
  const [PlayerEvent, setPlayerEvent] = useState<typeof PlayerEventType | null>(
    null,
  )

  useEffect(() => {
    setIsMounted(true)

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

  const handleMouseEnter = (): void => {
    if (!isHovered) {
      setIsHovered(true)
      setAnimationKey((prev) => prev + 1)
    }
  }

  const handleMouseLeave = (): void => {
    setIsHovered(false)
  }

  if (!isMounted || !Player) {
    return null
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ width: '145%', left: '-22.5%', ...style }}
    >
      <Player
        key={animationKey}
        loop={loop}
        autoplay={true}
        onEvent={handleEvent}
        style={{
          cursor: 'default',
          ...style,
        }}
        src={data}
        {...restProps}
      />
    </div>
  )
}
