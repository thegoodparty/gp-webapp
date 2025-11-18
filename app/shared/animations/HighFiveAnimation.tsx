'use client'
import React, { useState, useEffect, CSSProperties, ComponentType } from 'react'
import data from './highFive.json'

interface HighFiveAnimationProps {
  loop?: boolean
  style?: CSSProperties
  className?: string
  callback?: () => void
  [key: string]: unknown
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
  const [Player, setPlayer] = useState<ComponentType<any> | null>(null)
  const [PlayerEvent, setPlayerEvent] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)

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

